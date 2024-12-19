import { db } from "@/lib/db";
import { compileApplicationReceivedMail, sendMail } from "@/lib/emails/mail";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = await params;
    const { department, coverLetter, reference, referenceContact } =
      await req.json();

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Find the "Applied" status ID
    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Applied" },
    });

    const admins = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
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
        userId: user.userId,
        title: "Job Application Submitted",
        message: `Your job application has been submitted for ${
          department || "IT Department"
        } successfully.`,
        createdBy: NotificationCreator.Account, // Notification from the system.
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "New Job Application",
        message: `A new job application has been submitted by ${
          user.fullName
        } for ${department || "IT Department"}.`,
        createdBy: NotificationCreator.Applicant, // Notification from the system.
        senderImage: user.userImage,
        link: `/admin/applicants/${user.userId}`,
        type: NotificationType.General,
      })),
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "New Job Application",
        message: `A new job application has been submitted by ${
          user.fullName
        } for ${department || "IT Department"}.`,
        createdBy: NotificationCreator.Applicant, // Notification from the system.
        senderImage: user.userImage,
        link: `/admin/applicants/${user.userId}`,
        type: NotificationType.General,
      })),
    ];

    // Create the job application entry
    const jobApplication = await db.jobApplications.create({
      data: {
        userId: user.userId,
        applicationStatusId: applicationStatus?.id,
        resumeName: user.resumeName,
        resumeUrl: user.resumeUrl,
        resumePublicId: user.resumePublicId,
        coverLetter: coverLetter || "",
        department: department || "IT Department",
        reference: reference || "",
        referenceContact: referenceContact || "",
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    await db.userProfile.update({
      where: {
        userId: user.userId,
      },
      data: {
        applicationStatus: {
          connect: {
            name: "Applied",
          },
        },
        role: {
          connect: {
            name: "Applicant",
          },
        },
      },
    });

    const emailBody = await compileApplicationReceivedMail(user.fullName);
    const response = await sendMail({
      to: user.email,
      subject: "Application Received (The Truth International)",
      body: emailBody,
    });

    // if (!response?.messageId) {
    //   return NextResponse.json({
    //     message: "Notifications updated successfully.",
    //     jobApplication,
    //   });
    // } else {
    //   return new NextResponse("Failed to send email", { status: 500 });
    // }

    return NextResponse.json({
      message: "Notifications updated successfully.",
      jobApplication,
      response,
    });
  } catch (error) {
    console.error(`SUBMIT_RESUME_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
