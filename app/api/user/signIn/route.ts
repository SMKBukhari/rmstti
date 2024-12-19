import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: {
        email,
      },
      include: {
        role: true,
      }
    });

    if (!user) {
      return new NextResponse("User not found with this email", { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new NextResponse("Invalid Password", { status: 400 });
    }

    // Generate a session token and set expiry time (e.g., 1 hour)
    const sessionToken = uuidv4();
    const sessionExpiry = addDays(new Date(), 1); // Expires in 1 day


    await db.userProfile.update({
      where: { email },
      data: {
        loginSessionToken: sessionToken,
        loginSessionExpiry: sessionExpiry,
      },
    });

    await db.notifications.create({
      data: {
        userId:user.userId,
        title: "SinedIn",
        message: "You have successfully signed in.",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });


    // Return userId and isVerified status in the response
    return NextResponse.json({
      userId: user.userId,
      isVerified: user.isVerified,
      loginSessionToken: sessionToken, // Send session token to the client
      loginSessionExpiry: sessionExpiry, // Send session expiry to the client
      role: user.role?.name,
      message: "User SignedIn successfully",
    });
  } catch (error) {
    console.error(`SIGNIN_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
