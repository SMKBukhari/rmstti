import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import TotalEmployee from "./_components/Cards/TotalEmployee";
import TotalApplicant from "./_components/Cards/TotalApplicants";

const page = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
      status: true,
      jobExperience: true,
      education: true,
      department: {
        include: {
          users: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/signIn");
  }

  const previousMonthStart = new Date();
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  previousMonthStart.setDate(1);

  const previousMonthEnd = new Date(previousMonthStart);
  previousMonthEnd.setMonth(previousMonthEnd.getMonth() + 1);
  previousMonthEnd.setDate(0);
  
  const users = await db.userProfile.findMany({
    include: {
      role: true,
    }
  });

  // Filter the users to get the employees and applicants
  const employees = users.filter((user) => user.isHired === true);
  const applicants = users.filter((user) => user.role?.name === "Applicant");

  // Get the employees and applicants from the previous month
  const previousMonthEmployees = await db.userProfile.findMany({
    where: {
      isHired: true,
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      }
    }
  });

  // Get the applicants from the previous month
  const previousMonthApplicants = await db.userProfile.findMany({
    where: {
      role: {
        name: "Applicant"
      },
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      }
    }
  });

  // Calculate the percentage change in the number of employees
  const currentCountEmployees = employees.length;
  const previousCountEmployees = previousMonthEmployees.length;
  const percentageChange = previousCountEmployees
    ? ((currentCountEmployees - previousCountEmployees) / previousCountEmployees) * 100
    : 0;
    
  // Calculate the percentage change in the number of applicants
  const currentCountApplicants = applicants.length;
  const previousCountApplicants = previousMonthApplicants.length;
  const percentageChangeApplicants = previousCountApplicants
    ? ((currentCountApplicants - previousCountApplicants) / previousCountApplicants) * 100
    : 0;  
  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <TotalEmployee totalEmployees={currentCountEmployees} percentageChange={percentageChange} />
        <TotalApplicant totalEmployees={currentCountApplicants} percentageChange={percentageChangeApplicants} />
      </div>
    </>
  );
};

export default page;
