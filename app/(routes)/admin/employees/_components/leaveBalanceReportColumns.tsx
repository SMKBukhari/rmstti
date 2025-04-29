"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type LeaveBalanceManagementReportColumns = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  startDate: Date | string;
  endDate: Date | string;
  reason: string;
  entitledLeaves: string;
  type: "Adjustment" | "Leave" | "Absence";
};

export const columns: ColumnDef<LeaveBalanceManagementReportColumns>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(row.getValue("date") as Date, "PP"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue(
        "type"
      ) as LeaveBalanceManagementReportColumns["type"];
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            type === "Adjustment"
              ? "bg-blue-100 text-blue-800"
              : type === "Leave"
              ? "bg-purple-100 text-purple-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "From",
    cell: ({ row }) => {
      const startDate = row.getValue("startDate") as Date | string;
      return typeof startDate === "string" ? "-" : format(startDate, "PP");
    },
  },
  {
    accessorKey: "endDate",
    header: "To",
    cell: ({ row }) => {
      const endDate = row.getValue("endDate") as Date | string;
      return typeof endDate === "string" ? "-" : format(endDate, "PP");
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "entitledLeaves",
    header: "Days",
    cell: ({ row }) => {
      const days = parseFloat(row.getValue("entitledLeaves") as string);
      return (
        <span
          className={`font-medium ${
            days >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {days > 0 ? `+${days}` : days}
        </span>
      );
    },
  },
];
