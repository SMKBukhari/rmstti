"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, History, UserX } from "lucide-react";
import type {
  ContractRenewal,
  Department,
  Role,
  UserProfile,
} from "@prisma/client";
import { format } from "date-fns";

type EmployeeWithContract = UserProfile & {
  department: Department | null;
  role: Role | null;
  ContractRenewals: ContractRenewal[];
};

interface RejectedContractsColumnsProps {
  onViewHistory: (employee: EmployeeWithContract) => void;
}

export const rejectedContractsColumns = ({
  onViewHistory,
}: RejectedContractsColumnsProps): ColumnDef<EmployeeWithContract>[] => [
  {
    accessorKey: "fullName",
    header: "Employee Name",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className='flex items-center space-x-2'>
          <UserX className='h-4 w-4 text-red-500' />
          <div>
            <div className='font-medium'>{employee.fullName}</div>
            <div className='text-sm text-muted-foreground'>
              {employee.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.original.department;
      return department ? (
        <Badge variant='outline'>{department.name}</Badge>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => {
      const designation = row.original.designation;
      return designation || <span className='text-muted-foreground'>-</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Current Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return role ? (
        <Badge variant='secondary'>{role.name}</Badge>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
  },
  {
    id: "rejectionDate",
    header: "Rejection Date",
    cell: ({ row }) => {
      const employee = row.original;
      const rejectedRenewal = employee.ContractRenewals.find(
        (renewal) => renewal.status === "Rejected"
      );

      return rejectedRenewal?.responseDate ? (
        <div className='text-sm'>
          {format(new Date(rejectedRenewal.responseDate), "MMM dd, yyyy")}
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
  },
  {
    id: "rejectionReason",
    header: "Rejection Reason",
    cell: ({ row }) => {
      const employee = row.original;
      const rejectedRenewal = employee.ContractRenewals.find(
        (renewal) => renewal.status === "Rejected"
      );

      return rejectedRenewal?.rejectionReason ? (
        <div
          className='max-w-xs truncate text-sm'
          title={rejectedRenewal.rejectionReason}
        >
          {rejectedRenewal.rejectionReason}
        </div>
      ) : (
        <span className='text-muted-foreground'>No reason provided</span>
      );
    },
  },
//   {
//     accessorKey: "applicationStatus",
//     header: "Current Status",
//     cell: ({ row }) => {
//       const employee = row.original;
//       const applicationStatus = employee.applicationStatus;

//       return applicationStatus ? (
//         <Badge
//           variant={
//             applicationStatus.name === "Rejected" ? "destructive" : "default"
//           }
//         >
//           {applicationStatus.name}
//         </Badge>
//       ) : (
//         <Badge variant='outline'>Employee</Badge>
//       );
//     },
//   },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onViewHistory(employee)}>
              <History className='mr-2 h-4 w-4' />
              View History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
