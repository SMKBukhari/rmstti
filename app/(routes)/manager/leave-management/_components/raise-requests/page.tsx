import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns, LeaveRequestsColumns } from "./_components/columns";
import RaiseRequest from "./_components/RaiseRequest";

const ApplicantsPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

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

  const leaveTypes = await db.leaveType.findMany();

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Raise Requests' />
      </div>

      <RaiseRequest leaveType={leaveTypes} user={user} />

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedLeaveRequests}
          filterableColumns={[
            {
              id: "leaveType",
              title: "Leave Type",
              options: leaveTypes
                .map((leaveType) => leaveType.name)
                .filter(Boolean),
            },
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

export default ApplicantsPage;
