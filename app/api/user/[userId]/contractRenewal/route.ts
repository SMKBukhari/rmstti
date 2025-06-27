import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { compileContractRenewalMail, sendMail } from "@/lib/emails/mail";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await req.json();
    const { employeeId, ...renewalData } = body;

    // Verify the requesting user has permission
    const requestingUser = await db.userProfile.findUnique({
      where: { userId },
      include: { role: true },
    });

    if (
      !requestingUser ||
      !["Admin", "CEO"].includes(requestingUser.role?.name || "")
    ) {
      return NextResponse.json(
        { error: "You don't have permission to create contract renewals" },
        { status: 403 }
      );
    }

    // Get the employee
    const employee = await db.userProfile.findUnique({
      where: { userId: employeeId },
      include: { department: true, role: true },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Check if employee already has an active renewal
    if (employee.hasActiveRenewal) {
      return NextResponse.json(
        { error: "Employee already has an active contract renewal" },
        { status: 400 }
      );
    }

    // Get department and role names for the renewal
    const proposedDepartment = await db.department.findUnique({
      where: { id: renewalData.proposedDepartment },
    });

    const proposedRole = await db.role.findUnique({
      where: { id: renewalData.proposedRole },
    });

    // Create the contract renewal
    const contractRenewal = await db.contractRenewal.create({
      data: {
        userId: employeeId,
        status: "Pending",
        currentDesignation: employee.designation,
        currentDepartment: employee.department?.name,
        currentRole: employee.role?.name,
        currentSalary: employee.salary,
        currentStartDate: employee.contractStartDate || employee.DOJ,
        currentEndDate:
          employee.contractEndDate ||
          (employee.DOJ
            ? new Date(
                new Date(employee.DOJ).getTime() + 365 * 24 * 60 * 60 * 1000
              )
            : null),
        currentLeaves: employee.totalYearlyLeaves,
        proposedDesignation: renewalData.proposedDesignation,
        proposedDepartment: proposedDepartment?.name,
        proposedRole: proposedRole?.name,
        proposedSalary: renewalData.proposedSalary,
        proposedStartDate: new Date(renewalData.proposedStartDate),
        proposedEndDate: new Date(renewalData.proposedEndDate),
        proposedDuration: renewalData.proposedDuration,
        proposedLeaves: renewalData.proposedLeaves,
        contractOfferUrl: renewalData.contractOfferUrl,
        contractOfferName: renewalData.contractOfferName,
        contractOfferPublicId: renewalData.contractOfferPublicId,
        initiatedBy: renewalData.initiatedBy,
        initiatedByName: renewalData.initiatedByName,
        renewalNumber: renewalData.renewalNumber,
        notes: renewalData.notes,
        expiryDate: renewalData.expiryDate
          ? new Date(renewalData.expiryDate)
          : null,
        isPortalBlocked: true,
      },
    });

    // Update employee to mark as having active renewal
    await db.userProfile.update({
      where: { userId: employeeId },
      data: { hasActiveRenewal: true },
    });

    // Create notification for the employee
    await db.notifications.create({
      data: {
        userId: employeeId,
        title: "Contract Renewal Offer",
        message: `You have received a contract renewal offer. Please review and respond by ${
          renewalData.expiryDate
            ? new Date(renewalData.expiryDate).toLocaleDateString()
            : "the deadline"
        }.`,
        createdBy: "Admin",
        type: "Contract",
        link: "/dashboard",
      },
    });

    try {
      const emailBody = await compileContractRenewalMail(
        employee.fullName,
        renewalData.proposedDesignation,
        proposedDepartment?.name || "",
        renewalData.proposedSalary,
        renewalData.proposedDuration,
        renewalData.proposedStartDate,
        renewalData.proposedEndDate
      );

      await sendMail({
        to: employee.email,
        subject: "Contract Renewal Offer - Action Required",
        body: emailBody,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the entire operation if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Contract renewal created successfully",
      contractRenewal,
    });
  } catch (error) {
    console.error("Error creating contract renewal:", error);
    return NextResponse.json(
      { error: "Failed to create contract renewal" },
      { status: 500 }
    );
  }
}
