import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Replace with your actual Prisma client import

export const POST = async (req: Request) => {
  try {
    const { userId, imageUrl } = await req.json();

    if (!userId || !imageUrl) {
      return new NextResponse("User ID and Image URL are required", { status: 400 });
    }

    // Update the user's image in the database
    const updatedUser = await db.userProfile.update({
      where: { userId },
      data: { userImage: imageUrl },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Image Uploaded",
        message: "Your image has been uploaded successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({
      message: "Image uploaded and saved successfully",
      user: updatedUser,
      notification: sendNotification,
    });
  } catch (error) {
    console.error(`UPLOAD_IMAGE_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
