import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";

export async function checkAndEscalateComplaints() {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find complaints that are pending and older than 3 days
    const complaintsToEscalate = await db.complaints.findMany({
      where: {
        status: "Pending",
        createdAt: {
          lte: threeDaysAgo, // Complaints created before or on 3 days ago
        },
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    // Get the CEO
    const ceo = await db.userProfile.findFirst({
      where: {
        role: {
          name: "CEO",
        },
      },
    });

    if (!ceo) {
      console.error("No CEO found for escalation.");
      return;
    }

    for (const complaint of complaintsToEscalate) {
      // Update complaint status and assign to CEO
      await db.complaints.update({
        where: { id: complaint.id },
        data: {
          status: "Escalated to CEO",
          complaintTo: ceo.fullName + " - CEO",
        },
      });

      // Create notifications
      const escalationNotifications = [
        {
          userId: complaint.userId,
          title: "Complaint Escalated",
          message:
            "Your complaint has been automatically escalated to the CEO due to inactivity.",
          createdBy: NotificationCreator.Account,
          type: NotificationType.Alert,
        },
        {
          userId: ceo.userId,
          title: "Complaint Escalated",
          message: `A complaint from ${
            complaint.isAnonymous ? "Anonymous" : complaint.user.fullName
          } has been automatically escalated to you.`,
          createdBy: NotificationCreator.Account,
          type: NotificationType.Alert,
        },
      ];

      await db.notifications.createMany({
        data: escalationNotifications,
      });
    }
    console.log("Complaint escalation completed successfully.");
  } catch (error) {
    console.error("Error in complaint escalation:", error);
  }
}
