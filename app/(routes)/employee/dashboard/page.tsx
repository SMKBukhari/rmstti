import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import TotalEmployee from "./_components/Cards/TotalEmployee";
import TotalApplicant from "./_components/Cards/TotalApplicants";
import LeaveRequests from "./_components/Cards/LeaveRequests";
import TotalLeaves from "./_components/Cards/TotalLeaves";

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
      department: true,
    },
  });

  // Filter the users to get the employees and applicants
  const employees = users.filter(
    (emp) =>
      user.isHired === true && emp.department?.name === user.department?.name
  );
  const applicants = users.filter(
    (user) =>
      user.role?.name === "Applicant" &&
      user.department?.name === user.department?.name
  );

  // Get the employees and applicants from the previous month
  const previousMonthEmployees = await db.userProfile.findMany({
    where: {
      isHired: true,
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

  const leaveRequests = await db.leaveRequest.findMany({
    where: { userId: userId },
  });
  const pendingRequests = leaveRequests.filter(
    (req) => req.status === "Pending"
  );
  const approvedRequests = leaveRequests.filter(
    (req) => req.status === "Approved"
  );
  const rejectedRequests = leaveRequests.filter(
    (req) => req.status === "Rejected"
  );

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <LeaveRequests
          totalRequests={leaveRequests.length}
          statusCounts={{
            Pending: pendingRequests.length,
            Approved: approvedRequests.length,
            Rejected: rejectedRequests.length,
          }}
        />
        <TotalLeaves
          userId={userId}
        />
      </div>
    </>
  );
};

export default page;
