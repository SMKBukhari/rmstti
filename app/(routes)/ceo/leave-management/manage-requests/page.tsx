import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns, LeaveRequestsColumns } from "./_components/columns";

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
    include: {
      department: true,
    },
  });

  const leaveRequests = await db.leaveRequest.findMany({
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
      fullName: leaveRequest.user.fullName ?? "N/A",
      leaveType: leaveRequest.leaveType.name ?? "N/A",
      startDate: leaveRequest.startDate
        ? format(new Date(leaveRequest.startDate), "MMMM do, yyyy")
        : "N/A",
      endDate: leaveRequest.endDate
        ? format(new Date(leaveRequest.endDate), "MMMM do, yyyy")
        : "N/A",
      reason: leaveRequest.reason ?? "N/A",
      status: leaveRequest.status,
      userImage: leaveRequest.user.userImage ?? "N/A",
      approvedBy: leaveRequest.approvedBy ?? "N/A",
      rejectedBy: leaveRequest.rejectedBy ?? "N/A",
    })
  );

  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='flex items-center justify-between w-full'>
        <CustomBreadCrumb
          breadCrumbPage='Manage Employee Leave Requests'
          breadCrumbItem={[
            {
              label: "Leave Management",
              link: "/admin/leave-management/raise-requests",
            },
          ]}
        />
      </div>

      <div className='mt-6 w-full'>
        <DataTable
          columns={columns}
          data={formattedLeaveRequests}
          searchKey='leaveType'
        />
      </div>
    </div>
  );
};

export default ApplicantsPage;
