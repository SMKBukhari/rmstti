import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { id } = await req.json();

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
      where: { name: "Rejected" },
    });

    const jobApplication = await db.jobApplications.findFirst({
      where: {
        userId: applicant.userId,
      },
    });

    if (!jobApplication) {
      return new NextResponse("Job Application not found", { status: 404 });
    }

    const role = await db.role.findFirst({
      where: {
        name: "Applicant",
      },
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
        title: "You rejected the job offer",
        message: `You have rejected the job offer.`,
        link: "/dashboard",
        createdBy: NotificationCreator.Account, // Notification from the system.
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "An applicant has been rejected",
        message: `${applicant.fullName} has rejected the job offer in the ${jobApplication.department} department.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/ceo/rejected`,
        type: NotificationType.General,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "An applicant has been rejected",
        message: `${applicant.fullName} has rejected the job offer in the ${jobApplication.department} department.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/admin/rejected`,
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
        role: {
          connect: {
            id: role?.id,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Congratulations! Your are hired.",
      updatedJobApplication,
      notifications,
    });
  } catch (error) {
    console.error(`JOB_OFFER_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
