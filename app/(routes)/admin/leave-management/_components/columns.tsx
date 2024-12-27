"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";

export type LeaveRequestsColumns = {
  user: UserProfile | null;
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

export const columns: ColumnDef<LeaveRequestsColumns>[] = [
  {
    accessorKey: "leaveType",
    header: "Leave Type",
  },
  {
    accessorKey: "startDate",
    header: "From",
  },
  {
    accessorKey: "endDate",
    header: "To",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { user, id, leaveType, startDate } = row.original;
      return (
        <CellActions
          user={user}
          id={id}
          fullName={leaveType}
          email={startDate}
        />
      );
    },
  },
];
