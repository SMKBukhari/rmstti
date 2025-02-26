"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export type LeaveRequestsColumns = {
  user: UserProfile | null;
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

export const columns: ColumnDef<LeaveRequestsColumns>[] = [
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
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge
          variant={
            status === "Pending"
              ? "secondary"
              : status === "Approved"
              ? "default"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { user, id } = row.original;
      return <CellActions user={user} id={id} />;
    },
  },
];
