import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

async function checkAndEscalateComplaints() {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find complaints that are pending and older than 3 days
    const complaintsToEscalate = await db.complaints.findMany({
      where: {
        status: "Pending",
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    // Get CEO users
    const ceo = await db.userProfile.findFirst({
      where: {
        role: {
          name: "CEO",
        },
      },
    });

    for (const complaint of complaintsToEscalate) {
      // Update complaint status and escalate to CEO
      await db.complaints.update({
        where: { id: complaint.id },
        data: {
          status: "Escalated",
          complaintTo: ceo?.fullName + " - CEO",
        },
      });

      // Create notifications for the escalation
      const escalationNotifications = [
        // Notify the original complainant
        {
          userId: complaint.userId,
          title: "Complaint Escalated",
          message:
            "Your complaint has been automatically escalated to CEO due to inactivity",
          createdBy: NotificationCreator.Account,
          type: NotificationType.Alert,
        },
        // Notify all CEOs
        {
          userId: ceo?.userId as string,
          title: "Complaint Escalated",
          message: `A complaint from ${
            complaint.isAnonymous ? "Anonymous" : complaint.user.fullName
          } has been automatically escalated to you`,
          createdBy: NotificationCreator.Account,
          type: NotificationType.Alert,
        },
      ];

      await db.notifications.createMany({
        data: escalationNotifications,
      });
    }
  } catch (error) {
    console.error("Error in complaint escalation:", error);
  }
}

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { title, message, complaintTo, isAnonymous } = await req.json();

    if (!title || !message || !complaintTo) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await db.userProfile.findUnique({
      where: {
        userId,
      },
      include: {
        role: true,
        department: true,
        Requests: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const complaintToUser = await db.userProfile.findUnique({
      where: {
        userId: complaintTo,
      },
      include: {
        role: true,
        department: true,
      },
    });

    if (!complaintToUser) {
      return new NextResponse("Complaint user not found", { status: 404 });
    }

    if (complaintToUser.userId === user.userId) {
      return new NextResponse("You can't raise complaint to yourself", {
        status: 400,
      });
    }

    const admins = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
        },
        userId: {
          notIn: [user.userId, complaintToUser.userId],
        },
      },
    });

    const ceo = await db.userProfile.findMany({
      where: {
        role: {
          name: "CEO",
        },
        userId: {
          notIn: [user.userId, complaintToUser.userId],
        },
      },
    });

    const notifications = [
      {
        userId: user.userId,
        title: "Complaint Raised",
        message: `You have raised a complaint to ${complaintToUser.fullName} - ${complaintToUser.role?.name}`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      },
      {
        userId: complaintToUser.userId,
        title: "Complaint Raised",
        message: `${user.fullName} - ${user.role?.name} has raised a complaint to you`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Complaint Raised",
        message: `${user.fullName} - ${user.role?.name} has raised a complaint to ${complaintToUser.fullName} - ${complaintToUser.role?.name}`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Complaint Raised",
        message: `${user.fullName} - ${user.role?.name} has raised a complaint to ${complaintToUser.fullName} - ${complaintToUser.role?.name}`,
        createdBy:
          user.role?.name === "Employee"
            ? NotificationCreator.Employee
            : user.role?.name === "Manager"
            ? NotificationCreator.Manager
            : user.role?.name === "Admin"
            ? NotificationCreator.Admin
            : NotificationCreator.CEO,
        type: NotificationType.General,
      })),
    ];

    const complaints = await db.complaints.create({
      data: {
        user: {
          connect: {
            userId: user.userId,
          },
        },
        complaintTo:
          complaintToUser.fullName + " - " + complaintToUser.role?.name,
        title,
        message,
        isAnonymous,
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    setTimeout(()=> {
      checkAndEscalateComplaints();
    }, 1000 * 60)

    return NextResponse.json(complaints, { status: 201 });
  } catch (error) {
    console.error(`RAISE_COMPLAINT_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
