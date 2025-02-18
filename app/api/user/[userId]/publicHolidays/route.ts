import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { name, date } = await req.json();
    const { userId } = await params;

    if (!name || typeof name !== "string") {
      throw new Error("Invalid Holiday name");
    }

    if (!date) {
      throw new Error("Date is required.");
    }

    const company = await db.company.findFirst({
      where: {
        UserProfile: {
          some: {
            userId: userId,
          },
        },
      },
    });

    const newHoliday = await db.publicHoliday.create({
      data: {
        name,
        date,
        company: {
          connect: {
            id: company?.id,
          },
        },
      },
    });

    return NextResponse.json({ newHoliday });
  } catch (error) {
    console.error("Error creating User Skills:", error);
    return NextResponse.error();
  }
};
