import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import LeaveRequests from "./_components/Cards/LeaveRequests";
import TotalLeaves from "./_components/Cards/TotalLeaves";
import { format } from "date-fns";
import EmployeeBannerWarning from "./_components/userBannerWarning";

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

  const previousMonthStart = new Date();
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  previousMonthStart.setDate(1);

  const previousMonthEnd = new Date(previousMonthStart);
  previousMonthEnd.setMonth(previousMonthEnd.getMonth() + 1);
  previousMonthEnd.setDate(0);

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
        <LeaveRequests
          totalRequests={leaveRequests.length}
          statusCounts={{
            Pending: pendingRequests.length,
            Approved: approvedRequests.length,
            Rejected: rejectedRequests.length,
          }}
        />
        <TotalLeaves userId={userId} />
      </div>
    </>
  );
};

export default page;
