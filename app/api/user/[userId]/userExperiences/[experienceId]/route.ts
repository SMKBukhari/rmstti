import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { experienceId : string, userId:string } }
) => {
  try {
    
    const {experienceId, userId} = await params;

    const experience = await db.jobExperience.findUnique({
        where: {
            id: experienceId
        }
    })

    if (!experience || experience.id !== experienceId) {
        return new NextResponse("Experience not found!", { status: 404 });
    }

   
    await db.jobExperience.delete({
        where: {
            id: experienceId
        }
    });

    await db.notifications.create({
      data: {
        userId,
        title: "Experience Detail Deleted",
        message: "Your experience detail has been deleted successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({message: "Experience deleted successfully"});

  } catch (error) {
    console.log(`[EXPERIENCE_DELETED]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { experienceId: string, userId:string } }
) => {
  try {
    // Parse the request body to get the job experience details
    const { jobExperience } = await req.json();

    // Ensure jobExperience is provided and is an object
    if (!jobExperience || typeof jobExperience !== "object") {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    const { experienceId, userId } = params;

    // Check if the experience exists in the database
    const experience = await db.jobExperience.findUnique({
      where: {
        id: experienceId,
      },
    });

    // If the experience is not found, return a 404 response
    if (!experience) {
      return new NextResponse("Experience not found!", { status: 404 });
    }

    // Update the experience with the new data
    const updatedExperience = await db.jobExperience.update({
      where: {
        id: experienceId,
      },
      data: {
        jobTitle: jobExperience.jobTitle,
        employmentType: jobExperience.employmentType,
        companyName: jobExperience.companyName,
        location: jobExperience.location,
        startDate: jobExperience.startDate,
        currentlyWorking: jobExperience.currentlyWorking,
        endDate: jobExperience.endDate,
        description: jobExperience.description,
      },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Experience Detail Updated",
        message: "Your experience detail has been updated successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    // Return the updated experience
    return NextResponse.json({updatedExperience, sendNotification});

  } catch (error) {
    console.error(`[EXPERIENCE_UPDATE_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
