import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = await params;
    const { currentPassword, newPassword, ConfirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !ConfirmPassword) {
      return new NextResponse("All fields are required!", { status: 400 });
    }

    if (newPassword !== ConfirmPassword) {
      return new NextResponse("Passwords do not match", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return new NextResponse("Current password is incorrect", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateUser = await db.userProfile.update({
      where: { userId },
      data: { password: hashedPassword, ConfirmPassword: hashedPassword },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Password Updated",
        message: "Your password has been updated successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({ updateUser, sendNotification });
  } catch (error) {
    console.error(`CHANGE_PASSWORD_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
