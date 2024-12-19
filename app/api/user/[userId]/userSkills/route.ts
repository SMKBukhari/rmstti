import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
    req: Request,
    { params }: { params: { userId: string } }
  ) => {
    try {
      const { skills } = await req.json();
      const { userId } = await params;

      if (!Array.isArray(skills)) {
        throw new Error('Skills must be an array');
      }
  
      // Fetch existing Education for the user at once
      const existingSkills = await db.skills.findMany({
        where: {
          userProfileId: userId,
        },
        select: {
          name: true,
        },
      });
  
      const createdSkills = [];
      for (const skill of skills) {
        const {
          name,
          experienceLevel,
        } = skill;
  
        // Check if the Education already exists
        const existingEducation = existingSkills.find(
          (edu) =>
            edu.name === name
        );
  
        if (!existingEducation) {
          const createdSkill = await db.skills.create({
            data: {
              name,
              experienceLevel,
              userProfileId: userId,
            },
          });
  
          createdSkills.push(createdSkill);
        }
      }

      const createdSkillName = createdSkills.map((skill) => skill.name).join(", ");

      const sendNotification = await db.notifications.create({
        data: {
          userId,
          title: "Skill Added",
          message: `Your skills ${createdSkillName} has been added successfully`,
          createdBy: "Account",
          isRead: false,
          type: "General",
        },
      });
  
      return NextResponse.json({createdSkills, sendNotification});
    } catch (error) {
      console.error('Error creating User Skills:', error);
      return NextResponse.error();
    }
  };
  