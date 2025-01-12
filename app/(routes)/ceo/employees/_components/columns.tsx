"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import CellActions from "./CellActions";
import { UserProfile } from "@prisma/client";

export type Employee = {
  user: UserProfile | null;
  id: string;
  fullName: string;
  email: string;
  contact: string;
  userImage: string;
  department: string;
  designation: string;
  role: string;
  status: string;
  company: string;
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "userImage",
    header: "",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <Avatar className='w-10 h-10 object-cover'>
          <AvatarImage
            className='object-cover'
            src={employee.userImage}
            alt={employee.fullName}
          />
          <AvatarFallback>{employee.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <Link href={`/admin/employees/${employee.id}`}>
          {employee.fullName}
        </Link>
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
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Active"
              ? "default"
              : status === "Terminated"
              ? "destructive"
              : status === "Resigned"
              ? "outline"
              : "secondary"
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
      const { user, id, fullName, email, role, department, designation, company } =
        row.original;
      return (
        <CellActions
          user={user}
          id={id}
          fullName={fullName}
          email={email}
          department={department}
          designation={designation}
          role={role}
          company={company}
        />
      );
    },
  },
];
