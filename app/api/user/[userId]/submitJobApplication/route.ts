import { db } from "@/lib/db";
import { compileApplicationReceivedMail, sendMail } from "@/lib/emails/mail";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { jobId, department, coverLetter, reference, referenceContact } =
      await req.json();

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    // Find the "Applied" status ID
    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Applied" },
    });

    if (!applicationStatus) {
      return new NextResponse("Application status not found", { status: 404 });
    }

    // Find the "Applicant" role
    const applicantRole = await db.role.findFirst({
      where: { name: "Applicant" },
    });

    if (!applicantRole) {
      return new NextResponse("Applicant role not found", { status: 404 });
    }

    const existingApplication = await db.jobApplications.findFirst({
      where: {
        jobId: job.id,
        userId: user.userId,
      },
    });

    if (existingApplication) {
      return new NextResponse("You have already applied for this job", {
        status: 400,
      });
    }

    const [admins, ceo] = await Promise.all([
      db.userProfile.findMany({
        where: {
          role: {
            name: "Admin",
          },
        },
      }),
      db.userProfile.findMany({
        where: {
          role: {
            name: "CEO",
          },
        },
      }),
    ]);

    const notifications = [
      {
        userId: user.userId,
        title: `Job Application Submitted for ${job.title}`,
        message: `Your job application has been submitted for ${job.title} successfully.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: `New Job Application for ${job.title}`,
        message: `A new job application has been submitted by ${user.fullName} for ${job.title}.`,
        createdBy: NotificationCreator.Applicant,
        senderImage: user.userImage,
        link: `/ceo/applicants/${user.userId}`,
        type: NotificationType.General,
      })),
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: `New Job Application for ${job.title}`,
        message: `A new job application has been submitted by ${user.fullName} for ${job.title}.`,
        createdBy: NotificationCreator.Applicant,
        senderImage: user.userImage,
        link: `/admin/applicants/${user.userId}`,
        type: NotificationType.General,
      })),
    ];

    // Use a transaction to ensure all database operations succeed or fail together
    const [jobApplication, updatedUser] = await db.$transaction([
      db.jobApplications.create({
        data: {
          jobId: job.id,
          userId: user.userId,
          applicationStatusId: applicationStatus.id,
          resumeName: user.resumeName,
          resumeUrl: user.resumeUrl,
          resumePublicId: user.resumePublicId,
          coverLetter: coverLetter || "",
          department: department || "IT Department",
          reference: reference || "",
          referenceContact: referenceContact || "",
        },
      }),
      db.notifications.createMany({
        data: notifications,
      }),
      db.userProfile.update({
        where: {
          userId: user.userId,
        },
        data: {
          applicationStatusId: applicationStatus.id,
          roleId: applicantRole.id,
        },
      }),
    ]);

    const emailBody = await compileApplicationReceivedMail(user.fullName);
    const emailResponse = await sendMail({
      to: user.email,
      subject: `Application Received for ${job.title} (The Truth International)`,
      body: emailBody,
    });

    if (!emailResponse?.messageId) {
      console.warn(
        "Email sending failed, but application was submitted successfully."
      );
    }

    return NextResponse.json({
      message:
        "Application submitted successfully and user role updated to Applicant.",
      jobApplication,
      updatedUser,
      emailSent: !!emailResponse?.messageId,
    });
  } catch (error) {
    console.error(`SUBMIT_RESUME_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
