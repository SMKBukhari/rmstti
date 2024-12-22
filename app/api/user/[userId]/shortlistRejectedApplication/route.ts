import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const { applicantId } = await req.json();

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const applicant = await db.userProfile.findFirst({
      where: {
        userId: applicantId,
      },
    });

    if (!applicant) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

    // Find the "Interviewed" status ID
    const applicationStatus = await db.applicationStatus.findFirst({
      where: { name: "Applied" },
    });

    const jobApplication = await db.jobApplications.findFirst({
      where: {
        userId: applicant.userId,
      },
    });

    if (!jobApplication) {
      return new NextResponse("Job Application not found", { status: 404 });
    }

    const updatedJobApplication = await db.jobApplications.update({
      where: {
        id: jobApplication.id,
      },
      data: {
        applicationStatus: {
          connect: {
            id: applicationStatus?.id,
          },
        },
      },
    });

    await db.userProfile.update({
      where: {
        userId: applicant.userId,
      },
      data: {
        applicationStatus: {
          connect: {
           id: applicationStatus?.id,
          },
        },
        currentJobApplicationId: jobApplication.id,
        role: {
          connect: {
            name: "Applicant",
          },
        },
      },
    });

    // if (!response?.messageId) {
    //   return NextResponse.json({
    //     message: "Notifications updated successfully.",
    //     updatedJobApplication,
    //   });
    // } else {
    //   return new NextResponse("Failed to send email", { status: 500 });
    // }

    return NextResponse.json({
      message: `Applicant ${applicant?.fullName} has been shortlisted successfully.`,
      updatedJobApplication,
    });
  } catch (error) {
    console.error(`SUBMIT_RESUME_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
