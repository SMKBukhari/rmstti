import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await req.json();
    const { contractRenewalId, response, rejectionReason } = body;

    // Verify the user owns this contract renewal
    const contractRenewal = await db.contractRenewal.findFirst({
      where: {
        id: contractRenewalId,
        userId: userId,
        status: "Pending",
      },
      include: {
        user: true,
      },
    });

    if (!contractRenewal) {
      return NextResponse.json(
        { error: "Contract renewal not found or already responded" },
        { status: 404 }
      );
    }

    // Check if offer has expired
    if (contractRenewal.expiryDate && new Date() > contractRenewal.expiryDate) {
      await db.contractRenewal.update({
        where: { id: contractRenewalId },
        data: { status: "Expired" },
      });
      return NextResponse.json(
        { error: "Contract renewal offer has expired" },
        { status: 400 }
      );
    }

    // Update contract renewal with response
    const updatedContractRenewal = await db.contractRenewal.update({
      where: { id: contractRenewalId },
      data: {
        status: response === "accept" ? "Accepted" : "Rejected",
        responseDate: new Date(),
        rejectionReason: response === "reject" ? rejectionReason : null,
        isPortalBlocked: false, // Unblock portal access
      },
    });

    // Update user profile based on response
    if (response === "accept") {
      // Update user with new contract terms
      await db.userProfile.update({
        where: { userId },
        data: {
          designation: contractRenewal.proposedDesignation,
          salary: contractRenewal.proposedSalary,
          contractStartDate: contractRenewal.proposedStartDate,
          contractEndDate: contractRenewal.proposedEndDate,
          contractDuration: contractRenewal.proposedDuration,
          totalYearlyLeaves: contractRenewal.proposedLeaves || "0",
          hasActiveRenewal: false,
          // Update department and role if they changed
          departmentId: contractRenewal.proposedDepartment
            ? (
                await db.department.findFirst({
                  where: { name: contractRenewal.proposedDepartment },
                })
              )?.id
            : undefined,
          roleId: contractRenewal.proposedRole
            ? (
                await db.role.findFirst({
                  where: { name: contractRenewal.proposedRole },
                })
              )?.id
            : undefined,
        },
      });

      // Create success notification
      await db.notifications.create({
        data: {
          userId,
          title: "Contract Renewal Accepted",
          message:
            "Your contract has been successfully renewed with the new terms. Welcome to your new contract period!",
          createdBy: "Account",
          type: "Contract",
          link: "/profile",
        },
      });
    } else {
      // For rejected contracts, convert user to applicant status
      const applicantRole = await db.role.findFirst({
        where: { name: "Applicant" },
      });
      const rejectedStatus = await db.applicationStatus.findFirst({
        where: { name: "Rejected" },
      });

      await db.userProfile.update({
        where: { userId },
        data: {
          roleId: applicantRole?.id,
          applicationStatusId: rejectedStatus?.id,
          hasActiveRenewal: false,
          // Clear employee-specific fields
          designation: null,
          salary: null,
          departmentId: null,
          contractStartDate: null,
          contractEndDate: null,
          contractDuration: null,
          DOJ: null,
        },
      });

      // Create notification
      await db.notifications.create({
        data: {
          userId,
          title: "Contract Renewal Declined",
          message:
            "You have declined the contract renewal offer. Your employment status has been updated accordingly.",
          createdBy: "Account",
          type: "Contract",
          link: "/dashboard",
        },
      });
    }

    // Create notification for admin/HR
    const adminUsers = await db.userProfile.findMany({
      where: {
        role: {
          name: { in: ["Admin", "CEO"] },
        },
      },
    });

    for (const admin of adminUsers) {
      await db.notifications.create({
        data: {
          userId: admin.userId,
          title: `Contract Renewal ${
            response === "accept" ? "Accepted" : "Declined"
          }`,
          message: `${contractRenewal.user.fullName} has ${
            response === "accept" ? "accepted" : "declined"
          } their contract renewal offer.`,
          createdBy: "Employee",
          type: "Contract",
          link: "/admin/contract-management",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Contract renewal ${
        response === "accept" ? "accepted" : "declined"
      } successfully`,
      contractRenewal: updatedContractRenewal,
    });
  } catch (error) {
    console.error("Error responding to contract renewal:", error);
    return NextResponse.json(
      { error: "Failed to process contract response" },
      { status: 500 }
    );
  }
}
