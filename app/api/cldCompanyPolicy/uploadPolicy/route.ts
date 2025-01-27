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
    const file = formData.get("policy") as File;
    const companyId = formData.get("companyId") as string;

    if (!file || file.type !== "application/pdf") {
      return new NextResponse("Only PDF files are allowed", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Upload file to Cloudinary using upload_stream
    const uploadResponse = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "companyPolicy", // Specify folder
            resource_type: "raw", // Specify that it's not an image
            public_id: `${company?.name}.pdf`, // Use userId as public ID
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
      }
    );

    // Destructure properties from the uploadResponse
    const {
      secure_url: companyPolicyUrl,
      public_id: companyPolicyPublicId,
      original_filename: companyPolicyName,
    } = uploadResponse;

    // Optionally update the user record in the database
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        companyPolicyUrl,
        companyPolicyName: `${company?.name} Policy ${companyPolicyName}.pdf`,
        companyPolicyPublicId,
      },
    });

    return NextResponse.json({
      message: "Resume uploaded successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("UPLOAD_FILE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
