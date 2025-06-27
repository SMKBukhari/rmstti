"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ContractRenewalDialog } from "./ContractRenewalDialog";
import { ContractHistoryDialog } from "./ContractHistoryDialog";
import { columns } from "./columns";
import {
  FileCodeIcon as FileContract,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import type {
  ContractRenewal,
  Department,
  Role,
  UserProfile,
} from "@prisma/client";
import { rejectedContractsColumns } from "./rejected-contract-columns";

type EmployeeWithContract = UserProfile & {
  department: Department | null;
  role: Role | null;
  ContractRenewals: ContractRenewal[];
};

interface ContractManagementClientProps {
  employees: EmployeeWithContract[];
  departments: Department[];
  roles: Role[];
  currentUserId: string;
  currentUserName: string;
}

export default function ContractManagementClient({
  employees,
  departments,
  roles,
  currentUserId,
  currentUserName,
}: ContractManagementClientProps) {
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeWithContract | null>(null);
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  // Calculate contract statistics
  const getContractStats = () => {
    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const threeMonthsFromNow = new Date(
      now.getTime() + 90 * 24 * 60 * 60 * 1000
    );

    let expiringSoon = 0;
    let expiringThisMonth = 0;
    let activeRenewals = 0;
    let rejectedContracts = 0;

    employees.forEach((employee) => {
      const contractEndDate =
        employee.contractEndDate ||
        (employee.DOJ
          ? new Date(
              new Date(employee.DOJ).getTime() + 365 * 24 * 60 * 60 * 1000
            )
          : null);

      if (contractEndDate) {
        if (contractEndDate <= oneMonthFromNow) {
          expiringThisMonth++;
        } else if (contractEndDate <= threeMonthsFromNow) {
          expiringSoon++;
        }
      }

      if (employee.hasActiveRenewal) {
        activeRenewals++;
      }

      if (
        employee.ContractRenewals.some(
          (renewal) => renewal.status === "Rejected"
        )
      ) {
        rejectedContracts++;
      }
    });

    return {
      total: employees.length,
      expiringSoon,
      expiringThisMonth,
      activeRenewals,
      rejectedContracts,
    };
  };

  const stats = getContractStats();

  // Filter employees for different tabs
  const activeEmployees = employees.filter(
    (emp) =>
      !emp.ContractRenewals.some((renewal) => renewal.status === "Rejected")
  );

  const rejectedContracts = employees.filter((emp) =>
    emp.ContractRenewals.some((renewal) => renewal.status === "Rejected")
  );

  const handleRenewContract = (employee: EmployeeWithContract) => {
    setSelectedEmployee(employee);
    setIsRenewalDialogOpen(true);
  };

  const handleViewHistory = (employee: EmployeeWithContract) => {
    setSelectedEmployee(employee);
    setIsHistoryDialogOpen(true);
  };

  return (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Contracts
            </CardTitle>
            <FileContract className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Expiring This Month
            </CardTitle>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {stats.expiringThisMonth}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Expiring Soon</CardTitle>
            <Clock className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>
              {stats.expiringSoon}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Renewals
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {stats.activeRenewals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Rejected Contracts
            </CardTitle>
            <XCircle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {stats.rejectedContracts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue='active' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='active'>Active Contracts</TabsTrigger>
          <TabsTrigger value='rejected'>Rejected Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value='active' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Employee Contracts</CardTitle>
              <CardDescription>
                Manage and track all employee contracts, renewals, and expiry
                dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns({
                  onRenewContract: handleRenewContract,
                  onViewHistory: handleViewHistory,
                })}
                data={activeEmployees}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='rejected' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Rejected Contracts</CardTitle>
              <CardDescription>
                Employees who have rejected contract renewal offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={rejectedContractsColumns({
                  onViewHistory: handleViewHistory,
                })}
                data={rejectedContracts}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {selectedEmployee && (
        <>
          <ContractRenewalDialog
            employee={selectedEmployee}
            departments={departments}
            roles={roles}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            open={isRenewalDialogOpen}
            onOpenChange={setIsRenewalDialogOpen}
          />

          <ContractHistoryDialog
            employee={selectedEmployee}
            open={isHistoryDialogOpen}
            onOpenChange={setIsHistoryDialogOpen}
          />
        </>
      )}
    </div>
  );
}
