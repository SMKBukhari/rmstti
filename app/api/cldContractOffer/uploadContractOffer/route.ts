import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { db } from "@/lib/db";
import streamifier from "streamifier";

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("contractOffer") as File;
    const userId = formData.get("userId") as string;

    if (!file || file.type !== "application/pdf") {
      return new NextResponse("Only PDF files are allowed", { status: 400 });
    }

    const user = await db.userProfile.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Upload file to Cloudinary using upload_stream
    const uploadResponse = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "contractOffers", // Specify folder
            resource_type: "raw", // Specify that it's not an image
            public_id: `${user.fullName}_contract_renewal_${Date.now()}.pdf`,
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
      secure_url: contractOfferUrl,
      public_id: contractOfferPublicId,
      original_filename: contractOfferName,
    } = uploadResponse;

    return NextResponse.json({
      message: "Contract offer uploaded successfully",
      contractOffer: {
        contractOfferUrl,
        contractOfferName: `${user.fullName} Contract Renewal Offer ${contractOfferName}.pdf`,
        contractOfferPublicId,
      },
    });
  } catch (error) {
    console.error("UPLOAD_CONTRACT_OFFER_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
