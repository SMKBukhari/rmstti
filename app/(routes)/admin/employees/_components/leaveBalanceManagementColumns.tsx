"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type LeaveBalanceManagementColumns = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  reason: string;
  entitledLeaves: string;
};

export const columns: ColumnDef<LeaveBalanceManagementColumns>[] = [
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
