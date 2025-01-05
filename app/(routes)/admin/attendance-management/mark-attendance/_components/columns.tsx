"use client";

import { ColumnDef } from "@tanstack/react-table";
// import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";

export type attendanceRecordsColumns = {
  user: UserProfile | null;
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
};

export const columns: ColumnDef<attendanceRecordsColumns>[] = [
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const { user, id, leaveType, startDate } = row.original;
  //     return (
  //       <CellActions
  //         user={user}
  //         id={id}
  //         fullName={leaveType}
  //         email={startDate}
  //       />
  //     );
  //   },
  // },
];
