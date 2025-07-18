import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const employees = await db.userProfile.findMany({
      where: {
        status: {
          name: "Active",
        }
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        designation: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        userImage: true,
      },
    });

    if (!employees) {
      return new NextResponse("Employee(s) not found", { status: 404 });
    }

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error(`GET_EMPLOYEES_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};