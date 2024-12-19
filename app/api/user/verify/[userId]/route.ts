import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const user = await db.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { otpCode } = await req.json();

    if (!otpCode) {
      return new NextResponse("OTP is required", { status: 400 });
    }

    if (user.otpCode !== otpCode) {
      return new NextResponse("Invalid OTP", { status: 400 });
    }

    if (user.otpCodeExpiry && new Date() > new Date(user.otpCodeExpiry)) {
      return new NextResponse("OTP has expired!", { status: 401 });
    }

    const updatedUser = await db.userProfile.update({
      where: {
        userId: user.userId,
      },
      data: {
        isVerified: true,
      },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Account Verified",
        message: "Your account has been successfully verified",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({updatedUser, sendNotification});
  } catch (error) {
    console.log(`[OTP_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
