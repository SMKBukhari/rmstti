import { db } from "@/lib/db";
import { compileRejectedApplicationMail, sendMail } from "@/lib/emails/mail";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { applicantId, notifcationTitle, notificationMessage } =
      await req.json();

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const applicant = await db.userProfile.findFirst({
      where: {
        userId: applicantId,
      },
    });

    if (!applicant) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

    // Find the "Interviewed" status ID
    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Rejected" },
    });

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
        title: notifcationTitle,
        message: notificationMessage,
        createdBy: NotificationCreator.Account, // Notification from the system.
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: notifcationTitle,
        message: `Applicant ${applicant.fullName} has been rejected by ${user.fullName}.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/ceo/interviewees`,
        type: NotificationType.General,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "Interview Scheduled",
        message: `Applicant ${applicant.fullName} has been rejected by ${user.fullName}.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/admin/interviewees`,
        type: NotificationType.General,
      })),
    ];

    const jobApplication = await db.jobApplications.findFirst({
      where: {
        userId: applicant.userId,
      },
    });

    if (!jobApplication) {
      return new NextResponse("Job Application not found", { status: 404 });
    }

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
        currentJobApplicationId: jobApplication.id,
        role: {
          connect: {
            name: "Applicant",
          },
        },
      },
    });

    const emailBody = await compileRejectedApplicationMail(applicant.fullName);
    const response = await sendMail({
      to: applicant.email,
      subject: "Application Status Update",
      body: emailBody,
    });

    // if (!response?.messageId) {
    //   return NextResponse.json({
    //     message: "Notifications updated successfully.",
    //     updatedJobApplication,
    //   });
    // } else {
    //   return new NextResponse("Failed to send email", { status: 500 });
    // }

    return NextResponse.json({
      message: "Interview scheduled successfully.",
      updatedJobApplication,
      response,
    });
  } catch (error) {
    console.error(`SUBMIT_RESUME_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
