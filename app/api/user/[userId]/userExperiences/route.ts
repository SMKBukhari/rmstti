import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
    req: Request,
    { params }: { params: { userId: string } }
  ) => {
    try {
      const { jobExperience } = await req.json();
      const { userId } = await params;
  
      // Fetch existing job experiences for the user at once
      const existingExperiences = await db.jobExperience.findMany({
        where: {
          userProfileId: userId,
        },
        select: {
          jobTitle: true,
          employmentType: true,
          companyName: true,
          location: true,
        },
      });
  
      const createdExperiences = [];
      for (const experience of jobExperience) {
        const {
          jobTitle,
          employmentType,
          companyName,
          location,
          startDate,
          currentlyWorking,
          endDate,
          description,
        } = experience;
  
        // Check if the experience already exists
        const existingExperience = existingExperiences.find(
          (exp) =>
            exp.jobTitle === jobTitle &&
            exp.employmentType === employmentType &&
            exp.companyName === companyName &&
            exp.location === location
        );
  
        if (!existingExperience) {
          const createdExperience = await db.jobExperience.create({
            data: {
              jobTitle,
              employmentType,
              companyName,
              location,
              startDate,
              currentlyWorking,
              endDate,
              description,
              userProfileId: userId,
            },
          });
  
          createdExperiences.push(createdExperience);
        }
      }

      const sendNotification = await db.notifications.create({
        data: {
          userId,
          title: "New Experience Detail Added",
          message: "You have successfully added a new experience detail",
          createdBy: "Account",
          isRead: false,
          type: "General",
        },
      });
  
      return NextResponse.json({createdExperiences, sendNotification});
    } catch (error) {
      console.error('Error creating job experiences:', error);
      return NextResponse.error();
    }
  };
  