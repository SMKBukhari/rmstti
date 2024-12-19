import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { db } from "@/lib/db";

// Cloudinary configuration (replace with your keys)
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const POST = async (req: Request) => {
  try {
    const { userId, imagePublicId } = await req.json();

    if (!userId || !imagePublicId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Update the user in MongoDB to nullify the image
    const updatedUser = await db.userProfile.update({
      where: { userId },
      data: { userImage: null },
    });

    // Delete image from Cloudinary
    const result = await cloudinary.v2.api.delete_resources(
      [`userImages/${imagePublicId}`],
      {
        type: "upload",
        resource_type: "image",
      }
    );

    // Ensure Cloudinary's result is 'ok' to send success
    if (result?.deleted?.[`userImages/${imagePublicId}`] === "deleted") {
      const sendNotification = await db.notifications.create({
        data: {
          userId,
          title: "Image Deleted",
          message: "Your profile image has been deleted, you can upload a new one",
          createdBy: "Account",
          isRead: false,
          type: "General",
        },
      });
      return NextResponse.json({
        message: "Image deleted successfully",
        user: updatedUser,
        notification: sendNotification,
      });
    } else {
      console.error("Error deleting image:", result);
      return NextResponse.json(
        { message: "Failed to delete image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DELETE_IMAGE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
