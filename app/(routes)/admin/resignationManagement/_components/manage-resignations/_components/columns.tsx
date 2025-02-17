"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Preview from "@/components/PreviewEditorText";

export type ResignationRequestsColumns = {
  user: UserProfile | null;
  id: string;
  reason: string;
  date: string;
  status: string;
};

export const columns: ColumnDef<ResignationRequestsColumns>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const { reason } = row.original;
      return <Preview value={reason} />;
    },
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
