import { db } from "@/lib/db";
import { compileInterviewScheduledMail, sendMail } from "@/lib/emails/mail";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { addMinutes, format } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { interviewDateTime, applicantId, timezoneOffset } = await req.json();

    if (!interviewDateTime || isNaN(new Date(interviewDateTime).getTime())) {
      return new NextResponse("Invalid date format", { status: 400 });
    }

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // const utcDate = new Date(interviewDateTime);
    // const localDate = addMinutes(utcDate, -timezoneOffset);

    const utcDate = new Date(interviewDateTime);
    // Validate the date is in the future
    if (utcDate < new Date()) {
      return new NextResponse("Interview date cannot be in the past", {
        status: 400,
      });
    }

    const localDate = addMinutes(utcDate, -timezoneOffset);
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
          localDate,
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
        } on ${format(localDate, "eeee, MMMM do yyyy, h:mm a")} by ${
          user.fullName
        }.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/ceo/interviewees`,
        type: NotificationType.General,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "Interview Scheduled",
        message: `An interview has been scheduled for ${
          applicant.fullName
        } on ${format(localDate, "eeee, MMMM do yyyy, h:mm a")} by ${
          user.fullName
        }.`,
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
        interviewDate: localDate,
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
        currentJobApplicationId: jobApplication.id,
        role: {
          connect: {
            name: "Interviewee",
          },
        },
      },
    });

    const interviewDate = format(localDate, "eeee, MMMM do yyyy");
    const interviewTime = format(localDate, "h:mm a");

    console.log("Interview Scheduled: ", interviewDate, interviewTime);

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
    console.error(`SCHEDULE_INTERVIEW_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
