import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { skills } = await req.json();
    const { userId } = params;

    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: 'Skills must be an array' }, { status: 400 });
    }

    const createdSkills = [];
    for (const skill of skills) {
      const { name, experienceLevel } = skill;

      if (!name || !experienceLevel) {
        return NextResponse.json({ error: 'Missing skill name or experience level' }, { status: 400 });
      }

      try {
        const createdSkill = await db.skills.create({
          data: {
            name,
            experienceLevel,
            userProfileId: userId,
          },
        });
        createdSkills.push(createdSkill);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            // This error code means there was a unique constraint violation
            console.log(`Skill "${name}" already exists for this user.`);
            continue;
          }
        }
        throw error;
      }
    }

    if (createdSkills.length > 0) {
      const createdSkillNames = createdSkills.map((skill) => skill.name).join(", ");
      await db.notifications.create({
        data: {
          userId,
          title: "Skills Added",
          message: `Your skills ${createdSkillNames} have been added successfully`,
          createdBy: "Account",
          isRead: false,
          type: "General",
        },
      });

      return NextResponse.json({ createdSkills, message: 'Skills added successfully' });
    } else {
      return NextResponse.json({ message: 'No new skills were added. Skills may already exist for this user.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error creating User Skills:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
};

