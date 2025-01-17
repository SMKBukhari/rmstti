import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const DELETE = async (
  req: Request,
  { params }: { params: { categoryId: string; userId: string } }
) => {
  try {
    const { categoryId, userId } = await params;

    const cateogry = await db.requestCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!cateogry || cateogry.id !== categoryId) {
      return new NextResponse("Category not found!", { status: 404 });
    }

    const deletedCategoryName = cateogry.name;

    await db.requestCategory.delete({
      where: {
        id: categoryId,
      },
    });

    await db.notifications.create({
      data: {
        id: crypto.randomBytes(12).toString("hex"),
        userId,
        title: "Category Deleted",
        message: `Category (${deletedCategoryName}) has been deleted successfully.`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return new NextResponse("Cateogry deleted successfully", { status: 200 });
  } catch (error) {
    console.log(`[CATEGORY_DELETED]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string; categoryId: string } }
) {
  try {
    const { userId, categoryId } = params;
    const { name } = await req.json();

    const category = await db.requestCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const updatedDepartment = await db.department.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
      },
    });

    await db.notifications.create({
      data: {
        userId,
        title: "Department Updated",
        message: `Department "${category.name}" has been updated to "${name}".`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error("[CATEGORY_UPDATE_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
