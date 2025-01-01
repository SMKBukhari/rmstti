import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = await params;

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required!", { status: 400 });
    }

    const job = await db.job.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error(`JOB_CREATE_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
