import React from "react";
import RaiseRequest from "./_components/RaiseRequest";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns, LeaveRequestsColumns } from "./_components/columns";
import { format } from "date-fns";

const RequestsTabs = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const leaveRequests = await db.leaveRequest.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      user: true,
      leaveType: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedLeaveRequests: LeaveRequestsColumns[] = leaveRequests.map(
    (leaveRequest) => ({
      user: user,
      id: leaveRequest.id,
      leaveType: leaveRequest.leaveType.name ?? "N/A",
      startDate: leaveRequest.startDate
        ? format(new Date(leaveRequest.startDate), "MMMM do, yyyy")
        : "N/A",
      endDate: leaveRequest.endDate
        ? format(new Date(leaveRequest.endDate), "MMMM do, yyyy")
        : "N/A",
      reason: leaveRequest.reason ?? "N/A",
      status: leaveRequest.status,
    })
  );

  const requestsCategories = await db.requestCategory.findMany();

  const requestTo = await db.userProfile.findMany({
    where: {
      role: {
        name: {
          notIn: ["CEO", "User", "Applicant", "Interviewee"],
        },
      },
      NOT: {
        userId: user?.userId,
      },
    },
    include: {
      role: true,
    },
  });

  return (
    <div className='flex-col items-center justify-center flex'>
      <RaiseRequest
        requestTo={requestTo}
        requestCatogries={requestsCategories}
        user={user}
      />

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedLeaveRequests}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: ["Pending", "Approved", "Rejected"],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RequestsTabs;
