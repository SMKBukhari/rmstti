import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { compileResetLinkMail, sendMail } from "@/lib/emails/mail";

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: { email },
    });

    if (!user) {
      return new NextResponse("User does not exist", { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // Token valid for 10 minutes

    await db.userProfile.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/resetPassword?token=${resetToken}`;
    const emailBody = await compileResetLinkMail(
      user.fullName || "User",
      resetLink
    );

    try {
      const response = await sendMail({
        to: email,
        subject: "Password Reset Link (The Truth International)",
        body: emailBody,
      });

      const sendNotification = await db.notifications.create({
        data: {
          userId: user.userId,
          title: "Password Reset Link Sent",
          message: "A password reset link has been sent to your email",
          createdBy: "Account",
          isRead: false,
          type: "General",
        },
      });

      return NextResponse.json({
        message: "Reset link sent successfully",
        response,
        sendNotification,
      });
    } catch (emailError) {
      console.error(`EMAIL_SEND_ERROR: ${emailError}`);
      return new NextResponse("Failed to send email. Please try again later.", { status: 500 });
    }
  } catch (error) {
    console.error(`FORGOT_PASSWORD_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

