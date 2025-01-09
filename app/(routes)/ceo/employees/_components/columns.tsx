"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export type Employee = {
  id: string
  fullName: string
  email: string
  contact: string
  userImage: string
  department: string
  role: string
  status: string
}

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "userImage",
    header: "",
    cell: ({ row }) => {
      const employee = row.original
      return (
        <Avatar className="w-10 h-10">
          <AvatarImage src={employee.userImage} alt={employee.fullName} />
          <AvatarFallback>{employee.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const employee = row.original
      return <Link href={`/admin/employees/${employee.id}`}>{employee.fullName}</Link>
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
  },
]

