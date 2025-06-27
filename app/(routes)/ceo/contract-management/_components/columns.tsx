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
import {
  MoreHorizontal,
  FileCodeIcon as FileContract,
  History,
  AlertTriangle,
  Clock,
} from "lucide-react";
import type {
  ContractRenewal,
  Department,
  Role,
  UserProfile,
} from "@prisma/client";
import { format, differenceInDays, differenceInMonths } from "date-fns";

type EmployeeWithContract = UserProfile & {
  department: Department | null;
  role: Role | null;
  ContractRenewals: ContractRenewal[];
};

interface ColumnsProps {
  onRenewContract: (employee: EmployeeWithContract) => void;
  onViewHistory: (employee: EmployeeWithContract) => void;
}

export const columns = ({
  onRenewContract,
  onViewHistory,
}: ColumnsProps): ColumnDef<EmployeeWithContract>[] => [
  {
    accessorKey: "fullName",
    header: "Employee Name",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className='flex items-center space-x-2'>
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
        <span>{department.name}</span>
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
    header: "Role",
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
    accessorKey: "contractStartDate",
    header: "Contract Start",
    cell: ({ row }) => {
      const employee = row.original;
      const startDate = employee.contractStartDate || employee.DOJ;
      return startDate ? (
        <div className='text-sm'>
          {format(new Date(startDate), "MMM dd, yyyy")}
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      );
    },
  },
  {
    accessorKey: "contractEndDate",
    header: "Contract End",
    cell: ({ row }) => {
      const employee = row.original;
      const endDate =
        employee.contractEndDate ||
        (employee.DOJ
          ? new Date(
              new Date(employee.DOJ).getTime() + 365 * 24 * 60 * 60 * 1000
            )
          : null);

      if (!endDate) {
        return <span className='text-muted-foreground'>-</span>;
      }

      const now = new Date();
      const daysUntilExpiry = differenceInDays(new Date(endDate), now);

      let badgeVariant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      let icon = null;

      if (daysUntilExpiry < 0) {
        badgeVariant = "destructive";
        icon = <AlertTriangle className='h-3 w-3' />;
      } else if (daysUntilExpiry <= 30) {
        badgeVariant = "destructive";
        icon = <AlertTriangle className='h-3 w-3' />;
      } else if (daysUntilExpiry <= 90) {
        badgeVariant = "outline";
        icon = <Clock className='h-3 w-3' />;
      }

      return (
        <div className='space-y-1'>
          <div className='text-sm'>
            {format(new Date(endDate), "MMM dd, yyyy")}
          </div>
          {icon && (
            <Badge
              variant={badgeVariant}
              className='text-xs flex items-center gap-1'
            >
              {icon}
              {daysUntilExpiry < 0 ? "Expired" : `${daysUntilExpiry} days left`}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "contractDuration",
    header: "Duration",
    cell: ({ row }) => {
      const employee = row.original;
      const startDate = employee.contractStartDate || employee.DOJ;
      const endDate =
        employee.contractEndDate ||
        (employee.DOJ
          ? new Date(
              new Date(employee.DOJ).getTime() + 365 * 24 * 60 * 60 * 1000
            )
          : null);

      if (!startDate || !endDate) {
        return employee.contractDuration || "1 year";
      }

      const months = differenceInMonths(new Date(endDate), new Date(startDate));
      return months >= 12
        ? `${Math.floor(months / 12)} year${
            Math.floor(months / 12) > 1 ? "s" : ""
          }`
        : `${months} months`;
    },
  },
  {
    accessorKey: "contractRenewalCount",
    header: "Renewals",
    cell: ({ row }) => {
      const count = row.original.contractRenewalCount || 0;
      return (
        <Badge variant='outline'>
          {count === 0 ? "Initial" : `${count} renewal${count > 1 ? "s" : ""}`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "hasActiveRenewal",
    header: "Status",
    cell: ({ row }) => {
      const employee = row.original;
      const hasActiveRenewal = employee.hasActiveRenewal;
      const latestRenewal = employee.ContractRenewals[0];

      if (hasActiveRenewal && latestRenewal) {
        return (
          <Badge variant='secondary'>Renewal {latestRenewal.status}</Badge>
        );
      }

      return <Badge variant='default'>Active</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const employee = row.original;
      const now = new Date();
      const endDate =
        employee.contractEndDate ||
        (employee.DOJ
          ? new Date(
              new Date(employee.DOJ).getTime() + 365 * 24 * 60 * 60 * 1000
            )
          : null);

      const daysUntilExpiry = endDate
        ? differenceInDays(new Date(endDate), now)
        : 999;
      const canRenew = daysUntilExpiry <= 90 && !employee.hasActiveRenewal;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {canRenew && (
              <DropdownMenuItem onClick={() => onRenewContract(employee)}>
                <FileContract className='mr-2 h-4 w-4' />
                Renew Contract
              </DropdownMenuItem>
            )}
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
