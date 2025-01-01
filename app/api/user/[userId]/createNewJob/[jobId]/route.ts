import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string; jobId: string } }
) => {
  try {
    const { userId, jobId } = await params;

    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is missing!", { status: 401 });
    }

    const job = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Delete the Job Id
export const DELETE = async (
  req: Request,
  { params }: { params: { jobId: string; userId: string } }
) => {
  try {
    const { userId, jobId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is missing!", { status: 401 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found!", { status: 404 });
    }

    // Delete the Images from the Cloudinary sotrage
    // TODO: Add the Cloudinary storage import

    // Delete the attachments
    // TODO: Add the attachments import

    await db.attachments.deleteMany({
      where: {
        jobId,
      },
    });

    const deletedJob = await db.job.delete({
      where: {
        id: jobId,
        userId,
      },
    });

    return NextResponse.json(deletedJob);
  } catch (error) {
    console.log(`[JOB_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
