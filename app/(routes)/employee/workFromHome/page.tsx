import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { columns, LeaveRequestsColumns } from "./_components/columns";
import { format } from "date-fns";
import { cookies } from "next/headers";
import RaiseRequest from "./_components/RaiseRequest";

const WorkFromHomePage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const workFromHomeRequests = await db.workFromHome.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedWorkFromHomeRequests: LeaveRequestsColumns[] =
    workFromHomeRequests.map((workFromHomeRequest) => ({
      user: user,
      id: workFromHomeRequest.id,
      startDate: workFromHomeRequest.startDate
        ? format(new Date(workFromHomeRequest.startDate), "MMMM do, yyyy")
        : "N/A",
      endDate: workFromHomeRequest.endDate
        ? format(new Date(workFromHomeRequest.endDate), "MMMM do, yyyy")
        : "N/A",
      reason: workFromHomeRequest.reason ?? "N/A",
      status: workFromHomeRequest.status,
    }));

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Wrok From Home' />
      </div>

      <RaiseRequest user={user} />

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedWorkFromHomeRequests}
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

export default WorkFromHomePage;
