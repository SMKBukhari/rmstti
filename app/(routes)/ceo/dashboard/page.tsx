import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import TotalEmployee from "./_components/Cards/TotalEmployee";
import TotalApplicant from "./_components/Cards/TotalApplicants";
import LeaveRequests from "./_components/Cards/LeaveRequests";
import { AttendanceChart } from "./_components/AttendanceChart";
import WarningEmployees from "./_components/Cards/WarningsEmployees";

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
      status: true,
    },
  });

  // Filter the users to get the employees and applicants
  const employees = users.filter(
    (user) => user.isHired === true && user.status?.name === "Active"
  );
  // const applicants = users.filter(
  //   (user) => user.role?.name === "Applicant" && user.isHired === false
  // );

  const applicationStatus = await db.applicationStatus.findFirst({
    where: { name: "Applied" },
  });
  const applicants = await db.jobApplications.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
    },
    include: {
      user: true,
      job: true,
    },
  });

  const leaveRequests = await db.leaveRequest.findMany({
    where: {
      status: {
        in: ["Pending", "PendingHigherApproval"],
      },
    },
  });

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);

  const currentMonthLeaveRequests = await db.leaveRequest.findMany({
    where: {
      createdAt: {
        gte: currentMonthStart,
      },
    },
  });

  const previousMonthLeaveRequests = await db.leaveRequest.findMany({
    where: {
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  const currentLeaveCount = currentMonthLeaveRequests.length;
  const previousLeaveCount = previousMonthLeaveRequests.length;

  // Calculate percentage change
  const percentageChangeLeaves = previousLeaveCount
    ? ((currentLeaveCount - previousLeaveCount) / previousLeaveCount) * 100
    : 0;

  // Get the employees and applicants from the previous month
  const previousMonthEmployees = await db.userProfile.findMany({
    where: {
      isHired: true,
      status: {
        name: "Active",
      },
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  const warnings = await db.warnings.findMany({
    include: {
      user: true,
    },
  });

  // Get the applicants from the previous month
  const previousMonthApplicants = await db.jobApplications.findMany({
    where: {
      applicationStatusId: applicationStatus?.id,
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
    include: {
      user: true,
      job: true,
    },
  });

  // Calculate the percentage change in the number of employees
  const currentCountEmployees = employees.length;
  const previousCountEmployees = previousMonthEmployees.length;
  // Improved percentage calculation
  let percentageChange = 0;
  if (previousCountEmployees > 0) {
    percentageChange =
      ((currentCountEmployees - previousCountEmployees) /
        previousCountEmployees) *
      100;
  } else if (currentCountEmployees > 0) {
    percentageChange = 100; // Infinite% increase from 0
  }

  // Calculate the percentage change in the number of applicants
  const currentCountApplicants = applicants.length;
  const previousCountApplicants = previousMonthApplicants.length;
  // Improved percentage calculation
  let percentageChangeApplicants = 0;
  if (previousCountApplicants > 0) {
    percentageChangeApplicants =
      ((currentCountApplicants - previousCountApplicants) /
        previousCountApplicants) *
      100;
  } else if (currentCountApplicants > 0) {
    percentageChangeApplicants = 100; // Infinite% increase from 0
  }
  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <TotalEmployee
          totalEmployees={currentCountEmployees}
          percentageChange={percentageChange}
        />
        <TotalApplicant
          totalEmployees={currentCountApplicants}
          percentageChange={percentageChangeApplicants}
        />
        <LeaveRequests
          totalRequests={leaveRequests.length}
          percentageChange={percentageChangeLeaves}
        />
      </div>
      <div className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 h-full'>
        <div className='col-span-2'>
          <AttendanceChart />
        </div>
        <div className='h-full'>
          <WarningEmployees warnings={warnings} />
        </div>
      </div>
    </>
  );
};

export default page;
