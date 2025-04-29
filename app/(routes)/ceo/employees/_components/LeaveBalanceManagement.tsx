"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./leaveBalanceManagementColumns";
import { LeaveBalanceAdjustment, UserProfile } from "@prisma/client";
import LeaveBalanceManagementButton from "../[employeeId]/_components/LeaveBalanceManagementButton";

interface LeaveBalanceManagementProps {
  user: UserProfile | null;
  leaveBalanceManagement: (LeaveBalanceAdjustment & {
    user: UserProfile | null;
  })[];
}

const LeaveBalanceManagement = ({
  user,
  leaveBalanceManagement,
}: LeaveBalanceManagementProps) => {
  const formattedData = leaveBalanceManagement.map((management) => ({
    id: management.id,
    employeeId: management.userId,
    employeeName: management.user?.fullName || "",
    date: management.date,
    reason: management.reason,
    entitledLeaves: management.entitledLeaves,
  }));
  return (
    <div className='flex-col p-4 md:p-8 items-center justify-center flex'>
      <div className='space-y-5 w-full'>
        <LeaveBalanceManagementButton user={user} />
        <DataTable
          columns={columns}
          data={formattedData}
          title='Leave Balance Management'
        />
      </div>
    </div>
  );
};

export default LeaveBalanceManagement;
