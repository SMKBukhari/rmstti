import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const departments = await db.department.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: {
              where: {
                status: {
                  name: "Active",
                },
              },
            },
          },
        },
      },
    });

    if (!departments) {
      return new NextResponse("Department(s) not found", { status: 404 });
    }

    // Format the response to match your frontend expectations
    const formattedDepartments = departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      employeeCount: dept._count.users,
    }));

    return NextResponse.json(
      { departments: formattedDepartments },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET_DEPARTMENTS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
