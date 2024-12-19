import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { compileOTPMail, sendMail } from "@/lib/emails/mail";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = await params;
    const { currentEmail, newEmail } = await req.json();

    if (!currentEmail || !newEmail) {
      return new NextResponse("All fields are required!", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (currentEmail !== user.email) {
      return new NextResponse("Current email is incorrect");
    }

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const updateUser = await db.userProfile.update({
      where: {
        userId,
      },
      data: {
        email: newEmail,
        isVerified: false,
        otpCode,
        otpCodeExpiry,
      },
    });

    const emailBody = await compileOTPMail(user.fullName, otpCode);

    const response = await sendMail({
      to: newEmail,
      subject: "Email Verification (The Truth International)",
      body: emailBody,
    });

    await db.notifications.create({
      data: {
        userId: user.userId,
        title: "Email Updated",
        message: "Your email has been updated successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    // if (response?.messageId) {
    //   return NextResponse.json(updateUser, { status: 201 });
    // } else {
    //   await db.notifications.create({
    //     data: {
    //       userId: user.userId,
    //       title: "Email Updated Failed",
    //       message:
    //         "Your email has been updated successfully, but failed to send Mail to your email. Please try another email.",
    //       createdBy: "Account",
    //       isRead: false,
    //       type: "General",
    //     },
    //   });
    //   return new NextResponse("Failed to send Mail", {
    //     status: 500,
    //   });
    // }

    return NextResponse.json({
      message: "Email updated successfully",
      response,
      updateUser,
    })
  } catch (error) {
    console.error(`CHANGE_EMAIL_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
