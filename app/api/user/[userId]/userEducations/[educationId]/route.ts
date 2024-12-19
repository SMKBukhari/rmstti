import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { educationId : string, userId:string } }
) => {
  try {
    
    const {educationId, userId} = await params;

    const education = await db.education.findUnique({
        where: {
            id: educationId
        }
    })

    if (!education || education.id !== educationId) {
        return new NextResponse("Education not found!", { status: 404 });
    }

   
    await db.education.delete({
        where: {
            id: educationId
        }
    });

    await db.notifications.create({
      data: {
        userId,
        title: "Education Detail Deleted",
        message: "Your education detail has been deleted successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({message: "Education deleted successfully"});

  } catch (error) {
    console.log(`[EDUCATION_DELETED]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { educationId: string, userId:string } }
) => {
  try {
    // Parse the request body to get the Education details
    const { educations } = await req.json();

    // Ensure Education is provided and is an object
    if (!educations || typeof educations !== "object") {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    const { educationId, userId } = params;

    // Check if the Education exists in the database
    const education = await db.education.findUnique({
      where: {
        id: educationId,
      },
    });

    // If the Education is not found, return a 404 response
    if (!education) {
      return new NextResponse("Education not found!", { status: 404 });
    }

    // Update the Education with the new data
    const updateEducation = await db.education.update({
      where: {
        id: educationId,
      },
      data: {
        university: educations.university,
        degree: educations.degree,
        fieldOfStudy: educations.fieldOfStudy,
        grade: educations.grade,
        startDate: educations.startDate,
        endDate: educations.endDate,
        description: educations.description,
      },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Education Detail Updated",
        message: "Your education detail has been updated successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    // Return the updated Education
    return NextResponse.json({updateEducation, sendNotification});

  } catch (error) {
    console.error(`[EDUCATION_UPDATE_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
