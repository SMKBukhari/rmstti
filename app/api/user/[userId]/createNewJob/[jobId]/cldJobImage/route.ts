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

export async function POST(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const jobId = params.jobId;

    if (!file || !file.type.startsWith("image/")) {
      return new NextResponse("Only image files are allowed", { status: 400 });
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Upload file to Cloudinary using upload_stream
    const uploadResponse = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "jobCoverImages",
          public_id: `job_${jobId}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!);
          }
        }
      );
      
      streamifier.createReadStream(buffer).pipe(stream);
    });

    // Destructure properties from the uploadResponse
    const {
      secure_url: imageUrl,
      public_id: imagePublicId,
    } = uploadResponse;

    // Update the job record in the database
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        imageUrl,
        imagePublicId,
      },
    });

    return NextResponse.json({
      message: "Job cover image uploaded successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPLOAD_IMAGE_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job || !job.imagePublicId) {
      return new NextResponse("Job or image not found", { status: 404 });
    }

    // Delete the image from Cloudinary
    await cloudinary.v2.uploader.destroy(job.imagePublicId);

    // Update the job record in the database
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        imageUrl: null,
        imagePublicId: null,
      },
    });

    return NextResponse.json({
      message: "Job cover image deleted successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("DELETE_IMAGE_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

