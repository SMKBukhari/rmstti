import { db } from "@/lib/db";
import { compileJobOfferMail, sendMail } from "@/lib/emails/mail";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const {
      id,
      designation,
      department,
      salary,
      role,
      DOJ,
      totalYearlyLeaves,
      totalMonthlyLeaves,
    } = await req.json();

    if (!id || !designation || !department || !salary || !role || !DOJ) {
      return new NextResponse("Please provide all the required fields", {
        status: 400,
      });
    }

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const applicant = await db.userProfile.findFirst({
      where: {
        userId: id,
      },
    });

    if (!applicant) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Offered" },
    });

    const jobApplication = await db.jobApplications.findFirst({
      where: {
        userId: applicant.userId,
      },
    });

    if (!jobApplication) {
      return new NextResponse("Job Application not found", { status: 404 });
    }

    const adminExcepThisUser = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
        },
        userId: {
          not: user.userId,
        },
      },
    });

    const ceo = await db.userProfile.findMany({
      where: {
        role: {
          name: "CEO",
        },
      },
    });

    const notifications = [
      {
        userId: applicant.userId,
        title: "Job Offer",
        message: `Congratulations! You have been offered the position of ${designation} in the ${department} department.`,
        link: "/dashboard",
        createdBy: NotificationCreator.Account, // Notification from the system.
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Job Offer",
        message: `An job offer has been made to ${applicant.fullName} for the position of ${designation} in the ${department} department by ${user.fullName}.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/ceo/interviewees`,
        type: NotificationType.General,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "Job Offer",
        message: `An job offer has been made to ${applicant.fullName} for the position of ${designation} in the ${department} department by ${user.fullName}.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/admin/interviewees`,
        type: NotificationType.General,
      })),
    ];

    const updatedJobApplication = await db.jobApplications.update({
      where: {
        id: jobApplication.id,
      },
      data: {
        applicationStatus: {
          connect: {
            id: applicationStatus?.id,
          },
        },
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    await db.userProfile.update({
      where: {
        userId: applicant.userId,
      },
      data: {
        applicationStatus: {
          connect: {
            id: applicationStatus?.id,
          },
        },
        salaryOffered: salary,
        departmentOffered: department,
        designationOffered: designation,
        roleOffered: role,
        DOJ: new Date(DOJ),
        totalYearlyLeaves: totalYearlyLeaves,
        totalMonthlyLeaves: totalMonthlyLeaves,
      },
    });

    const emailBody = await compileJobOfferMail(
      applicant.fullName,
      designation,
      department,
      salary
    );
    const response = await sendMail({
      to: applicant.email,
      subject: "Job Offer",
      body: emailBody,
    });

    return NextResponse.json({
      message: "Job offer sent successfully",
      updatedJobApplication,
      notifications,
      response,
    });
  } catch (error) {
    console.error(`JOB_OFFER_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
