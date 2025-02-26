import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { columns, LeaveRequestsColumns } from "./_components/columns";

const ManageLeaveRequests = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      department: true,
    },
  });

  const workFromHomeRequests = await db.workFromHome.findMany({
    include: {
      user: true,
    },
  });

  // Formatting the applicants data for the table
  const formattedLeaveRequests: LeaveRequestsColumns[] =
    workFromHomeRequests.map((workFromRequest) => ({
      user: user,
      id: workFromRequest.id,
      fullName: workFromRequest.user.fullName ?? "N/A",
      startDate: workFromRequest.startDate
        ? format(new Date(workFromRequest.startDate), "MMMM do, yyyy")
        : "N/A",
      endDate: workFromRequest.endDate
        ? format(new Date(workFromRequest.endDate), "MMMM do, yyyy")
        : "N/A",
      reason: workFromRequest.reason ?? "N/A",
      status: workFromRequest.status,
      userImage: workFromRequest.user.userImage ?? "N/A",
      approvedBy: workFromRequest.aprrovedBy ?? "N/A",
      rejectedBy: workFromRequest.rejectedBy ?? "N/A",
    }));

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb breadCrumbPage='Manage Employee Work From Home Requests' />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedLeaveRequests}
          filterableColumns={[
            {
              id: "fullName",
              title: "Name",
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

export default ManageLeaveRequests;
