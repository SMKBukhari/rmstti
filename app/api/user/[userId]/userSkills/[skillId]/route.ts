import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const DELETE = async (
  req: Request,
  { params }: { params: { skillId : string, userId:string } }
) => {
  try {
    
    const {skillId, userId} = await params;

    const skill = await db.skills.findUnique({
        where: {
            id: skillId
        }
    })

    if (!skill || skill.id !== skillId) {
        return new NextResponse("Skill not found!", { status: 404 });
    }

    const deletedSkillName = skill.name;
   
    await db.skills.delete({
        where: {
            id: skillId
        }
    });


    await db.notifications.create({
      data: {
        id: crypto.randomBytes(12).toString("hex"),
        userId,
        title: "Skill Deleted",
        message: `Your skill ${deletedSkillName} has been deleted successfully`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({message: "Skill deleted successfully"});

  } catch (error) {
    console.log(`[SKILL_DELETED]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { skillId: string, userId:string } }
) => {
  try {
    // Parse the request body to get the Education details
    const { skills } = await req.json();

    // Ensure Education is provided and is an object
    if (!skills || typeof skills !== "object") {
      return new NextResponse("Invalid data format", { status: 400 });
    }

    const { skillId, userId } = params;

    // Check if the Education exists in the database
    const skill = await db.skills.findUnique({
      where: {
        id: skillId,
      },
    });

    // If the Education is not found, return a 404 response
    if (!skill) {
      return new NextResponse("Skill not found!", { status: 404 });
    }

    const updatedSkillName = skill.name;

    // Update the Education with the new data
    const updateEducation = await db.skills.update({
      where: {
        id: skillId,
      },
      data: {
        name: skills.name,
        experienceLevel: skills.experienceLevel,
      },
    });

    const sendNotification = await db.notifications.create({
      data: {
        id: crypto.randomBytes(12).toString("hex"),
        userId,
        title: "Skill Updated",
        message: `Your skill ${updatedSkillName} has been updated successfully`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    // Return the updated Education
    return NextResponse.json({updateEducation, sendNotification});

  } catch (error) {
    console.error(`[SKILL_UPDATE_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
