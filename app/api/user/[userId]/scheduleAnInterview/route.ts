import { db } from "@/lib/db";
import {
  compileInterviewScheduledMail,
  sendMail,
} from "@/lib/emails/mail";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = await params;
    const { interviewDateTime, applicantId } = await req.json();

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
      where: { name: "Interviewed" },
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
        title: "Interview Scheduled",
        message: `Your interview has been scheduled on ${format(
          new Date(interviewDateTime),
          "eeee, MMMM do yyyy, h:mm a"
        )}. Please be prepared.`,
        createdBy: NotificationCreator.Account, // Notification from the system.
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Interview Scheduled",
        message: `An interview has been scheduled for ${
          applicant.fullName
        } on ${format(
          new Date(interviewDateTime),
          "eeee, MMMM do yyyy, h:mm a"
        )} by ${user.userId}.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/admin/interviewees`,
        type: NotificationType.General,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "Interview Scheduled",
        message: `An interview has been scheduled for ${
          applicant.fullName
        } on ${format(
          new Date(interviewDateTime),
          "eeee, MMMM do yyyy, h:mm a"
        )} by ${user.userId}.`,
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
        interviewDate: interviewDateTime,
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
            name: "Interviewed",
          },
        },
        role: {
          connect: {
            name: "Interviewee",
          },
        },
      },
    });

    const interviewDate = format(
      new Date(interviewDateTime),
      "eeee, MMMM do yyyy"
    );
    const interviewTime = format(new Date(interviewDateTime), "h:mm a");

    const emailBody = await compileInterviewScheduledMail(
      applicant.fullName,
      interviewDate,
      interviewTime
    );
    const response = await sendMail({
      to: applicant.email,
      subject: "Interview Scheduled (The Truth International)",
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
