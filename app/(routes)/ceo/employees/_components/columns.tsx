"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import CellActions from "./CellActions";
import { Department, Role, Status, UserProfile } from "@prisma/client";

export type Employee = {
  user: UserProfile | null;
  roleCombo: Role[] | null;
  statusCombo: Status[] | null;
  departmentCombo: Department[] | null;
  id: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  userImage: string;
  role: string;
  company: string;
  gender: "Male" | "Female" | "Other" | "Select";
  contactNumber: string;
  cnic: string;
  DOB: Date;
  DOJ: Date;
  city: string;
  country: string;
  address: string;
  status: string;
  salary: string;
  officeTimingIn: string;
  officeTimingOut: string;
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
            className='object-cover object-center w-full h-full'
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
      const {
        user,
        id,
        fullName,
        email,
        role,
        department,
        designation,
        company,
        DOB,
        DOJ,
        address,
        city,
        country,
        cnic,
        contactNumber,
        gender, 
        officeTimingIn,
        officeTimingOut,
        roleCombo,
        statusCombo,
        salary,
        status,
        departmentCombo,
      } = row.original;
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
          DOB={DOB}
          DOJ={DOJ}
          address={address}
          city={city}
          country={country}
          contactNumber={contactNumber}
          cnic={cnic}
          gender={gender}
          officeTimingIn={officeTimingIn}
          officeTimingOut={officeTimingOut}
          roleCombo={roleCombo}
          statusCombo={statusCombo}
          departmentCombo={departmentCombo}
          salary={salary}
          status={status}
        />
      );
    },
  },
];
