"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CellActions from "./CellActions";
import { Badge } from "@/components/ui/badge";
import { UserProfile, WorkStatus } from "@prisma/client";

export type AttendanceRecord = {
  id: string;
  fullName: string;
  status: string;
  userImage: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  department: string;
  role: string;
  workStatus: WorkStatus[] | null;
  user: UserProfile | null;
};

export const columns: ColumnDef<AttendanceRecord>[] = [
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
    sortingFn: "datetime",
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
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Present"
              ? "secondary"
              : status === "Absent"
              ? "destructive"
              : "default"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status, fullName, user, workStatus } = row.original;
      return (
        <CellActions
          id={id}
          status={status}
          fullName={fullName}
          user={user}
          workStatus={workStatus}
        />
      );
    },
  },
];
