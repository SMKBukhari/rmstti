import { db } from "@/lib/db";
import { compileHiredMail, sendMail } from "@/lib/emails/mail";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { id, designation, department, salary, joiningDate, role } =
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
        userId: id,
      },
    });

    if (!applicant) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Hired" },
    });

    const status = await db.status.findFirst({
      where: {
        name: "Active",
      },
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
        title: "Congratulations! You have been hired.",
        message: `Congratulations ${applicant.fullName}! You have been hired for the position of ${designation} in the ${department} department. Your salary is ${salary}.`,
        link: "/dashboard",
        createdBy: NotificationCreator.Account, // Notification from the system.
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "An applicant has been hired",
        message: `${applicant.fullName} has been hired for the position of ${designation} in the ${department} department by ${user.fullName}.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/ceo/employees`,
        type: NotificationType.General,
      })),
      ...adminExcepThisUser.map((admin) => ({
        userId: admin.userId,
        title: "An applicant has been hired",
        message: `${applicant.fullName} has been hired for the position of ${designation} in the ${department} department by ${user.fullName}.`,
        createdBy: NotificationCreator.Admin, // Notification from the system.
        senderImage: user.userImage,
        link: `/admin/employees`,
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
        salary: salary,
        designation: designation,
        department: {
          connect: {
            name: department,
          },
        },
        isHired: true,
        DOJ: joiningDate,
        role: {
          connect: {
            name: role,
          },
        },
        status: {
          connect: {
            id: status?.id,
          },
        },
      },
    });

    const emailBody = await compileHiredMail(
      applicant.fullName,
      designation,
      department,
      salary,
      joiningDate
    );
    const response = await sendMail({
      to: applicant.email,
      subject: "Congratulations! You have been hired",
      body: emailBody,
    });

    return NextResponse.json({
      message: "Congratulations! Your are hired.",
      updatedJobApplication,
      notifications,
      response,
    });
  } catch (error) {
    console.error(`JOB_OFFER_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
