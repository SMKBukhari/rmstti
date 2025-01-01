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
    const file = formData.get("file") as File;
    const jobId = params.jobId;

    if (!file || file.type !== "application/pdf") {
      return new NextResponse("Only PDF files are allowed", { status: 400 });
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
          folder: "jobAttachments",
          resource_type: "raw",
          public_id: `job_${jobId}_${Date.now()}`,
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
      secure_url: url,
      public_id: publicId,
      original_filename: name,
    } = uploadResponse;

    // Create a new attachment record in the database
    const attachment = await db.attachments.create({
      data: {
        jobId,
        name,
        url,
        publicId,
      },
    });

    return NextResponse.json({
      message: "Attachment uploaded successfully",
      attachment,
    });
  } catch (error) {
    console.error("UPLOAD_ATTACHMENT_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;

    const attachments = await db.attachments.findMany({
      where: { jobId },
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.error("GET_ATTACHMENTS_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}




