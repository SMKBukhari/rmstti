import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
    req: Request,
    { params }: { params: { userId: string } }
  ) => {
    try {
      const { educations } = await req.json();
      const { userId } = await params;
  
      // Fetch existing Education for the user at once
      const existingEducations = await db.education.findMany({
        where: {
          userProfileId: userId,
        },
        select: {
          university: true,
          degree: true,
          fieldOfStudy: true,
        },
      });
  
      const createdEducations = [];
      for (const education of educations) {
        const {
          university,
          degree,
          fieldOfStudy,
          grade,
          startDate,
          currentlyStudying,
          endDate,
          description,
        } = education;
  
        // Check if the Education already exists
        const existingEducation = existingEducations.find(
          (edu) =>
            edu.university === university &&
            edu.degree === degree &&
            edu.fieldOfStudy === fieldOfStudy
        );
  
        if (!existingEducation) {
          const createdEducation = await db.education.create({
            data: {
              university,
              degree,
              fieldOfStudy,
              grade,
              startDate,
              currentlyStudying,
              endDate,
              description,
              userProfileId: userId,
            },
          });
  
          createdEducations.push(createdEducation);
        }
      }

      const sendNotification = await db.notifications.create({
        data: {
          userId,
          title: "New Education Detail Added",
          message: "You have successfully added a new education detail.",
          createdBy: "Account",
          isRead: false,
          type: "General",
        },
      });
  
      return NextResponse.json({createdEducations, sendNotification});
    } catch (error) {
      console.error('Error creating User Educations:', error);
      return NextResponse.error();
    }
  };
  