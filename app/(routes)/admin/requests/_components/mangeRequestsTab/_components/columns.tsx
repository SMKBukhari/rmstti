"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";
import Preview from "@/components/PreviewEditorText";
import { Badge } from "@/components/ui/badge";

export type RequestsColumns = {
  user: UserProfile | null;
  id: string;
  date: string;
  requestCategory: string;
  requestMessage: string;
  status: string;
};

export const columns: ColumnDef<RequestsColumns>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "requestCategory",
    header: "Request Category",
  },
  {
    accessorKey: "requestMessage",
    header: "Request Message",
    cell: ({ row }) => {
      const { requestMessage } = row.original;
      return (
        <div>
          <Preview value={requestMessage} />
        </div>
      );
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
              ? "outline"
              : status === "Completed"
              ? "default"
              : status === "In Progress"
              ? "secondary"
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
      return (
        <CellActions
          user={user}
          id={id}
        />
      );
    },
  },
];
