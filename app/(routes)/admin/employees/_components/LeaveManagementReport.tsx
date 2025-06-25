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

  // Function to calculate the number of days between two dates
  const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.floor(dayDiff) + 1; // +1 to include both start and end dates
  };

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
      .map((req) => {
        const leaveDays = calculateLeaveDays(
          new Date(req.startDate),
          new Date(req.endDate)
        );
        return {
          id: req.id,
          employeeId: employee.userId,
          employeeName: employee.fullName,
          date: req.createdAt,
          startDate: req.startDate,
          endDate: req.endDate,
          reason: req.reason,
          entitledLeaves: `-${leaveDays}`, // Deduct the actual number of leave days
          type: "Leave" as const,
        };
      });

    // Format data from attendance records (absences)
    const absenceData = employee.Attendence.filter(
      (att) => att.workStatus?.name === "Absent"
    ).map((att) => {
      const absenceDate = calculateLeaveDays(
        new Date(att.date),
        new Date(att.date)
      );
      return {
        id: att.id,
        employeeId: employee.userId,
        employeeName: employee.fullName,
        date: att.date,
        startDate: att.date, // Same as date for single-day absence
        endDate: att.date, // Same as date for single-day absence
        reason: "Deducted for absence",
        entitledLeaves: `-${absenceDate}`, // Deduct one day for absence
        type: "Absence" as const,
      };
    });

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
