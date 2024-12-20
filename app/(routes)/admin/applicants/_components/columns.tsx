"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, File } from "lucide-react";
import Link from "next/link";
import CellActions from "./CellActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ApplicantsColumns = {
  id: string;
  fullName: string;
  email: string;
  contact: string;
  appliedAt: string;
  userImage: string;
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type='checkbox'
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        aria-label='Select all rows'
      />
    ),
    cell: ({ row }) => (
      <input
        type='checkbox'
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label='Select row'
      />
    ),
  },
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
      return (
        <Link href={`/admin/applicants/${row.original.id}`}>{fullName}</Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applied Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, fullName, email } = row.original;
      return <CellActions id={id} fullName={fullName} email={email} />;
    },
  },
];
