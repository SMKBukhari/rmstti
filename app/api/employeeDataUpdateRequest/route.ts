import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId, values } = await req.json();
    console.log("Received request:", { userId, values });

    const user = await db.userProfile.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      console.log("User not found:", userId);
      return new NextResponse("User not found", { status: 404 });
    }

    console.log("User found:", user);

    const adminExceptThisUser = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
        },
        NOT: {
          userId: userId,
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

    console.log("Admins found:", adminExceptThisUser.length);
    console.log("CEOs found:", ceo.length);

    const notifications = [
      {
        userId: userId,
        title: "Profile Update Request",
        message: `Your profile update request has been submitted successfully.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Profile Update Request",
        message: `Employee ${user.fullName} has requested a profile update.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/requests/profileUpdateRequests`,
        type: NotificationType.General,
      })),
      ...adminExceptThisUser.map((admin) => ({
        userId: admin.userId,
        title: "Profile Update Request",
        message: `Employee ${user.fullName} has requested a profile update.`,
        createdBy: NotificationCreator.Admin,
        senderImage: user.userImage,
        link: `/admin/requests/profileUpdateRequests`,
        type: NotificationType.General,
      })),
    ];

    console.log("Notifications to be created:", notifications.length);

    // Create a new profile update request in the database
    const updateRequest = await db.profieUpdateRequests.create({
      data: {
        userId,
        fullName: values.fullName,
        email: user.email, // Assuming email is not updated
        password: user.password, // Use the existing password from the user profile
        ConfirmPassword: user.ConfirmPassword, // Include if applicable
        gender: values.gender,
        contactNumber: values.contactNumber,
        DOB: values.DOB,
        country: values.country,
        city: values.city,
        address: values.address,
        aprroved: false,
        rejected: false,
      },
    });

    console.log("Update request created:", updateRequest);

    // Send notifications
    const createdNotifications = await db.notifications.createMany({
      data: notifications,
    });

    console.log("Notifications created:", createdNotifications);

    return NextResponse.json({ updateRequest });
  } catch (error) {
    console.error(`USER_UPDATE_PATCH: ${error}`);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
