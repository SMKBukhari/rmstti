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

export async function DELETE(
  req: Request,
  { params }: { params: { jobId: string; attachmentId: string } }
) {
  try {
    const { jobId, attachmentId } = params;

    const attachment = await db.attachments.findUnique({
      where: { id: attachmentId, jobId },
    });

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Delete the file from Cloudinary
    await cloudinary.v2.uploader.destroy(attachment.publicId, {
      resource_type: "raw",
    });

    // Delete the attachment record from the database
    await db.attachments.delete({
      where: { id: attachmentId },
    });

    return NextResponse.json({
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_ATTACHMENT_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
