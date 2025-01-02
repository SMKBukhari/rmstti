"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type LeaveRequestsColumns = {
  user: UserProfile | null;
  id: string;
  fullName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvedBy?: string;
  rejectedBy?: string;
  userImage: string;
};

export const columns: ColumnDef<LeaveRequestsColumns>[] = [
  {
    accessorKey: "userImage",
    header: "",
    cell: ({ row }) => {
      const { userImage, fullName } = row.original;
      return (
        <Avatar className='w-10 h-10'>
          <AvatarImage src={userImage} alt={fullName} />
          <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { fullName } = row.original;
      return <p>{fullName}</p>;
    },
  },
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
    accessorKey: "approvedOrRejectedBy",
    header: ({ table }) => {
      // Check if the table rows have "Approved" or "Rejected" statuses
      const hasApproved = table
        .getRowModel()
        .rows.some((row) => row.original.status === "Approved");
      const hasRejected = table
        .getRowModel()
        .rows.some((row) => row.original.status === "Rejected");

      if (hasApproved && !hasRejected) return "Approved By";
      if (hasRejected && !hasApproved) return "Rejected By";
      return "Approved/Rejected By"; // Default header if both statuses exist
    },
    cell: ({ row }) => {
      const { status, approvedBy, rejectedBy } = row.original;
      if (status === "Approved") {
        return <p>{approvedBy || "N/A"}</p>;
      } else if (status === "Rejected") {
        return <p>{rejectedBy || "N/A"}</p>;
      }
      return null; // For "Pending" or other statuses, do not display anything
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { user, id, leaveType, startDate, status } = row.original;
      return (
        <CellActions
          user={user}
          id={id}
          fullName={leaveType}
          email={startDate}
          status={status}
        />
      );
    },
  },
];
