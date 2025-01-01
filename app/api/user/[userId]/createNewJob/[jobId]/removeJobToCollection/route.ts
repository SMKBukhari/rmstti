import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string; userId: string } }
) => {
  try {
    const { jobId, userId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is missing", { status: 404 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Parse savedUsers into an array if it's a string, or initialize as an empty array
    const savedUsers: string[] =
      typeof job.savedUsers === "string"
        ? JSON.parse(job.savedUsers)
        : Array.isArray(job.savedUsers)
        ? job.savedUsers
        : [];

    const userIndex = savedUsers.indexOf(userId);

    let updatedJob;

    if (userIndex > -1) {
      updatedJob = await db.job.update({
        where: {
          id: jobId,
        },
        data: {
          savedUsers: JSON.stringify(savedUsers.filter((id) => id !== userId)), // Convert back to string
        },
      });
    }

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.log(`[JOB_PUBLISH_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
