"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserProfile, WorkStatus } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CellActions from "./CellActions";

export type attendanceRecordsColumns = {
  user: UserProfile | null;
  workStatus: WorkStatus[] | null;
  status: string;
  id: string;
  fullName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  userImage: string;
};

export const columns: ColumnDef<attendanceRecordsColumns>[] = [
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
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "checkIn",
    header: "Check In",
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
  },
  {
    accessorKey: "workingHours",
    header: "Working Hours",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { user, id, workStatus, status, fullName } = row.original;
      return (
        <CellActions
          user={user}
          id={id}
          status={status}
          workStatus={workStatus}
          fullName={fullName}
        />
      );
    },
  },
];
