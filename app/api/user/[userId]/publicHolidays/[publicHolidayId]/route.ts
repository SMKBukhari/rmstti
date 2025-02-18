import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { publicHolidayId: string } }
) => {
  try {
    const { publicHolidayId } = await params;

    const publicHoliday = await db.publicHoliday.findUnique({
      where: {
        id: publicHolidayId,
      },
    });

    if (!publicHoliday || publicHoliday.id !== publicHolidayId) {
      return new NextResponse("Public Holiday not found!", { status: 404 });
    }

    await db.publicHoliday.delete({
      where: {
        id: publicHolidayId,
      },
    });

    return new NextResponse("Department deleted successfully", { status: 200 });
  } catch (error) {
    console.log(`[SKILL_DELETED]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
