import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { db } from "@/lib/db";
import streamifier from "streamifier";

// Cloudinary configuration (replace with your keys)
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const userId = formData.get("userId") as string;

    if (!file || file.type !== "application/pdf") {
      return new NextResponse("Only PDF files are allowed", { status: 400 });
    }

    const user = await db.userProfile.findUnique({
        where: { userId },
    });

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Upload file to Cloudinary using upload_stream
    const uploadResponse = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "userResumes", // Specify folder
          resource_type: "raw", // Specify that it's not an image
          public_id: `${userId}.pdf`,     // Use userId as public ID
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!);
          }
        }
      );
      
      // Upload the buffer as a stream
      streamifier.createReadStream(buffer).pipe(stream);
    });

    // Destructure properties from the uploadResponse
    const {
      secure_url: resumeUrl,
      public_id: resumePublicId,
      original_filename: resumeName,
    } = uploadResponse;

    // Optionally update the user record in the database
    const updatedUser = await db.userProfile.update({
      where: { userId: userId },
      data: {
        resumeUrl,
        resumeName: `${user?.fullName} ${resumeName}.pdf`,
        resumePublicId,
      },
    });

    await db.notifications.create({
        data: {
            userId,
            title: "Resume Uploaded",
            message: "Your resume has been uploaded successfully",
            createdBy: "Account",
            isRead: false,
            type: "General",
        },
    });

    return NextResponse.json({
      message: "Resume uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPLOAD_FILE_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
