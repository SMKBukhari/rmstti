import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { compileOTPMail, sendMail } from "@/lib/emails/mail";
import Cookies from "js-cookie";

export const POST = async (req: Request) => {
  try {
    const {
      fullName,
      email,
      password,
      ConfirmPassword,
      gender,
      DOB,
      country,
      city,
      contactNumber,
    } = await req.json();

    if (!fullName || !email || !password || !gender || !contactNumber) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    if (password !== ConfirmPassword) {
      return new NextResponse("Passwords do not match", { status: 400 });
    }

    const userExist = await db.userProfile.findFirst({
      where: {
        email,
      },
    });

    if (userExist) {
      return new NextResponse(
        "User/Email already exist! Please use your email and password to login",
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const userRole = await db.role.findFirst({
      where: {
        name: "User",
      },
    });

    if (!userRole) {
      return new NextResponse("User Role not found", { status: 500 });
    }

    const company = await db.company.findFirst({});

    const user = await db.userProfile.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        ConfirmPassword: hashedPassword,
        gender,
        DOB,
        country,
        city,
        contactNumber,
        otpCode,
        otpCodeExpiry,
        isVerified: false,
        role: {
          connect: {
            id: userRole.id,
          },
        },
        company: {
          connect: {
            id: company?.id,
          },
        },
      },
    });

    const emailBody = await compileOTPMail(fullName, otpCode);

    const response = await sendMail({
      to: email,
      subject: "Email Verification (The Truth International)",
      body: emailBody,
    });

    await db.notifications.create({
      data: {
        userId: user.userId,
        title: "Account Created",
        message: "Your account has been successfully created",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    Cookies.set("userId", user.userId, {
      expires: 1,
    });

    // if (response?.messageId) {
    //   return NextResponse.json(user, { status: 201 });
    // } else {
    //   await db.notifications.create({
    //     data: {
    //       userId: user.userId,
    //       title: "Account Created Failed",
    //       message: "Your account has been successfully created, but failed to send Mail.",
    //       createdBy: "Account",
    //       isRead: false,
    //       type: "UserCreation",
    //     },
    //   });
    //   return new NextResponse("User created but failed to send Mail", {
    //     status: 500,
    //   });
    // }

    return NextResponse.json({ user, response }, { status: 201 });
  } catch (error) {
    console.error(`SINGUP_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
