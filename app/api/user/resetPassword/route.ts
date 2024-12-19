import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const { token, password, ConfirmPassword } = await req.json();

    if (!token || !password || !ConfirmPassword) {
      return new NextResponse("All fields are required!", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      return new NextResponse("Invalid reset token", { status: 404 });
    }

    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      return new NextResponse("Reset token has expired", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.userProfile.update({
      where: { userId: user.userId },
      data: {
        password: hashedPassword,
        ConfirmPassword: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    await db.notifications.create({
      data: {
        userId: user.userId,
        title: "Password Reset Successful",
        message: "You have successfully reset your password",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return new NextResponse("Password Reset successfully", { status: 200 });
  } catch (error) {
    console.error(`RESET_PASSWORD_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
