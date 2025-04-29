"use client";
import { DataTable } from "@/components/ui/data-table";
import {
  Attendence,
  LeaveBalanceAdjustment,
  LeaveRequest,
  UserProfile,
  WorkStatus,
} from "@prisma/client";
import React from "react";
import { columns } from "./leaveBalanceReportColumns";

interface LeaveManagementReportProps {
  employees: (UserProfile & {
    leaveBalanceAdjustment: LeaveBalanceAdjustment[];
    leaveRequests: LeaveRequest[];
    Attendence: (Attendence & { workStatus: WorkStatus | null })[];
  })[];
}

const LeaveManagementReport = ({ employees }: LeaveManagementReportProps) => {
  if (!employees || employees.length === 0) {
    return <div>No employee data available</div>;
  }

  // Process all employees' data
  const allRecords = employees.flatMap((employee) => {
    // Format data from leave balance adjustments
    const adjustmentData = employee.leaveBalanceAdjustment.map((adj) => ({
      id: adj.id,
      employeeId: employee.userId,
      employeeName: employee.fullName,
      date: adj.date,
      startDate: "", // Not applicable for adjustments
      endDate: "", // Not applicable for adjustments
      reason: adj.reason,
      entitledLeaves: adj.entitledLeaves,
      type: "Adjustment" as const,
    }));

    // Format data from leave requests (approved leaves)
    const leaveRequestData = employee.leaveRequests
      .filter((req) => req.status === "Approved")
      .map((req) => ({
        id: req.id,
        employeeId: employee.userId,
        employeeName: employee.fullName,
        date: req.createdAt,
        startDate: req.startDate,
        endDate: req.endDate,
        reason: req.reason,
        entitledLeaves: "-1", // Deduct 1 day per leave request
        type: "Leave" as const,
      }));

    // Format data from attendance records (absences)
    const absenceData = employee.Attendence.filter(
      (att) => att.workStatus?.name === "Absent"
    ).map((att) => ({
      id: att.id,
      employeeId: employee.userId,
      employeeName: employee.fullName,
      date: att.date,
      startDate: att.date, // Same as date for single-day absence
      endDate: att.date, // Same as date for single-day absence
      reason: "Deducted for absence",
      entitledLeaves: "-1", // Deduct 1 day per absence
      type: "Absence" as const,
    }));

    return [...adjustmentData, ...leaveRequestData, ...absenceData];
  });

  // Sort all records by date (newest first)
  const formattedData = allRecords.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className='space-y-4'>
      <DataTable
        columns={columns}
        data={formattedData}
        title='Leave Balance Report'
      />
    </div>
  );
};

export default LeaveManagementReport;