import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const userProfile = await db.userProfile.findFirst({
      where: { userId },
      include: { role: true },
    });

    if (!userProfile) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error(`GET_USER_PROFILE_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
