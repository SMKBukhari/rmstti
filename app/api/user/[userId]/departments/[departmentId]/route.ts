import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const DELETE = async (
  req: Request,
  { params }: { params: { departmentId: string; userId: string } }
) => {
  try {
    const { departmentId, userId } = await params;

    const department = await db.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department || department.id !== departmentId) {
      return new NextResponse("Department not found!", { status: 404 });
    }

    const deletedDepartmentName = department.name;

    await db.department.delete({
      where: {
        id: departmentId,
      },
    });

    await db.notifications.create({
      data: {
        id: crypto.randomBytes(12).toString("hex"),
        userId,
        title: "Department Deleted",
        message: `Department (${deletedDepartmentName}) has been deleted successfully.`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return new NextResponse("Department deleted successfully", { status: 200 });
  } catch (error) {
    console.log(`[SKILL_DELETED]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string; departmentId: string } }
) {
  try {
    const { userId, departmentId } = params;
    const { name } = await req.json();

    const department = await db.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return new NextResponse("Department not found", { status: 404 });
    }

    const updatedDepartment = await db.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name,
      },
    });

    await db.notifications.create({
      data: {
        userId,
        title: "Department Updated",
        message: `Department "${department.name}" has been updated to "${name}".`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error("[DEPARTMENT_UPDATE_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
