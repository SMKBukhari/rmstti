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
    const { userId, filePublicId } = await req.json();

    if (!userId || !filePublicId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedUser = await db.userProfile.update({
      where: { userId },
      data: { 
        resumeName: null,
        resumeUrl: null,
        resumePublicId: null,
       },
    });

    // Delete image from Cloudinary
    const result = await cloudinary.v2.api.delete_resources(
      [`${filePublicId}`],
      {
        type: "upload",
        resource_type: "raw",
      }
    );

    // Ensure Cloudinary's result is 'ok' to send success
    if (result?.deleted?.[`${filePublicId}`] === "deleted") {
      const sendNotification = await db.notifications.create({
        data: {
          userId,
          title: "Resume Deleted",
          message: "Your resume has been deleted, you can upload a new one",
          createdBy: "Account",
          isRead: false,
          type: "General",
        },
      });
      return NextResponse.json({
        message: "Resume deleted successfully",
        user: updatedUser,
        notification: sendNotification,
      });
    } else {
      console.error("Error deleting Resume:", result);
      return NextResponse.json(
        { message: "Failed to delete Resume" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DELETE_RESUME_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
