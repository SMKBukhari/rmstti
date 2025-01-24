"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";
import Preview from "@/components/PreviewEditorText";
import { Badge } from "@/components/ui/badge";

export type ComplaintsColumns = {
  user: UserProfile | null;
  id: string;
  date: string;
  complaintTitle: string;
  complaintMessage: string;
  complaintFrom: string;
  status: string;
  isAnonymous: boolean;
};

export const columns: ColumnDef<ComplaintsColumns>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "complaintFrom",
    header: "Complaint From",
    cell: ({ row }) => {
      const { complaintFrom, isAnonymous } = row.original;
      return <div>{isAnonymous ? "Anonymous" : complaintFrom}</div>;
    },
  },
  {
    accessorKey: "complaintTitle",
    header: "Title",
  },
  {
    accessorKey: "complaintMessage",
    header: "Complaint Message",
    cell: ({ row }) => {
      const { complaintMessage } = row.original;
      return (
        <div>
          <Preview value={complaintMessage} />
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
      return <CellActions user={user} id={id} />;
    },
  },
];
