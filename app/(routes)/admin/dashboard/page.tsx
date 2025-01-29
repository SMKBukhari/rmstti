import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import TotalEmployee from "./_components/Cards/TotalEmployee";
import TotalApplicant from "./_components/Cards/TotalApplicants";
import { format } from "date-fns";
import EmployeeBannerWarning from "./_components/userBannerWarning";
import LeaveRequests from "./_components/Cards/LeaveRequests";
import { AttendanceChart } from "./_components/AttendanceChart";
import BalanceLeaves from "./_components/Cards/BalanceLeaves";

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
      leaveRequests: true,
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

  if (user.role?.name !== "Admin") {
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
  const applicants = users.filter((user) => user.role?.name === "Applicant");

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

  // Get the applicants from the previous month
  const previousMonthApplicants = await db.userProfile.findMany({
    where: {
      role: {
        name: "Applicant",
      },
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  // Calculate the percentage change in the number of employees
  const currentCountEmployees = employees.length;
  const previousCountEmployees = previousMonthEmployees.length;
  const percentageChange = previousCountEmployees
    ? ((currentCountEmployees - previousCountEmployees) /
        previousCountEmployees) *
      100
    : 0;

  // Calculate the percentage change in the number of applicants
  const currentCountApplicants = applicants.length;
  const previousCountApplicants = previousMonthApplicants.length;
  const percentageChangeApplicants = previousCountApplicants
    ? ((currentCountApplicants - previousCountApplicants) /
        previousCountApplicants) *
      100
    : 0;

  const today = format(new Date(), "yyyy-MM-dd");
  const warning = await db.warnings.findFirst({
    where: {
      userId: userId,
      createdAt: {
        gte: new Date(today),
        lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
      },
    },
  });
  return (
    <>
      {warning && (
        <EmployeeBannerWarning
          warningTitle={warning.title}
          warningMessage={warning.message}
          senderDesignation={warning.senderDesignation}
        />
      )}
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
        <BalanceLeaves user={user} />
      </div>
      <div className='mt-10'>
        <AttendanceChart />
      </div>
    </>
  );
};

export default page;
