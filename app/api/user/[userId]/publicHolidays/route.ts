import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { name, date, for: forEmployees } = await req.json();
    const { userId } = await params;

    if (!name || typeof name !== "string") {
      throw new Error("Invalid Holiday name");
    }

    console.log(forEmployees);

    if (!date) {
      throw new Error("Date is required.");
    }

    if (!forEmployees) {
      return NextResponse.json("Employee selection is required", {
        status: 400,
      });
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

    if (!company) {
      return NextResponse.json("Company not found", { status: 404 });
    }

    const isForAll = forEmployees === "all";

    const newHoliday = await db.publicHoliday.create({
      data: {
        name,
        date,
        isForAll,
        company: {
          connect: {
            id: company?.id,
          },
        },
        ...(isForAll
          ? {}
          : {
              employees: {
                connect: {
                  userId: forEmployees,
                },
              },
            }),
      },
      include: {
        employees: true,
      },
    });

    return NextResponse.json({ newHoliday });
  } catch (error) {
    console.error("Error creating User Skills:", error);
    return NextResponse.error();
  }
};
