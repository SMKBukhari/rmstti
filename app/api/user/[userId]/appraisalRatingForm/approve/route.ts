import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { id } = await req.json();

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const existingAppraisal = db.appraisal.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingAppraisal) {
      return new NextResponse("Appraisal with this ID not found", {
        status: 404,
      });
    }

    const addAppraisal = await db.appraisal.update({
      where: {
        id: id,
      },
      data: {
        approved: true,
      },
    });

    return NextResponse.json({
      message: "Appraisal Approved Successfully",
      addAppraisal,
    });
  } catch (error) {
    console.error(`APPROVED_APPRAISAL_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
