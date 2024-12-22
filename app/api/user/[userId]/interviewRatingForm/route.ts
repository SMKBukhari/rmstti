import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const {
      id,
      interviewDate,
      appearance,
      communication,
      reasoning,
      education,
      jobKnowledge,
      workExperience,
      generalKnowledge,
      iq,
      pose,
      personality,
      salaryExpectations,
      strengths,
      weaknesses,
      remarks,
      interviewerName,
      interviewerDesignation,
    } = await req.json();

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const applicant = await db.userProfile.findFirst({
      where: {
        userId: id,
      },
    });

    if (!applicant) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

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
        interviewDate,
        isInterviewed: true,
        appearance,
        communication,
        reasoning,
        education,
        jobKnowledge,
        workExperience,
        generalKnowledge,
        iq,
        pose,
        personality,
        strengths,
        weaknesses,
        remarks,
        salaryExpectation: salaryExpectations,
        interviewerName,
        interviewerDesignation,
      },
    });

    return NextResponse.json({
      message: "Interview Saved Successfully",
      updatedJobApplication,
    });
  } catch (error) {
    console.error(`SUBMIT_RESUME_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
