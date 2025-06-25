"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { UserProfile } from "@prisma/client";
import { Calculator, Loader2, Search } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { CalculateAttendanceSchema } from "@/schemas";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DialogForm from "@/components/DialogForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface CalculateAttendancePageProps {
  user: UserProfile | null;
}

interface Employee {
  userId: string;
  fullName: string;
  email: string;
  department?: {
    name: string;
  };
  designation?: string;
}

interface CalculationResult {
  userId: string;
  fullName: string;
  totalDaysChecked: number;
  unauthorizedAbsences: string[];
  lateArrivals: string[];
  earlyExits: string[];
  leavesDeducted: number;
  previousLateCount: number;
  newLateCount: number;
}

interface CalculationSummary {
  totalEmployees: number;
  totalDaysChecked: number;
  totalUnauthorizedAbsences: number;
  totalLateArrivals: number;
  totalEarlyExits: number;
  totalLeavesDeducted: number;
}

export default function CalculateAttendancePage({
  user,
}: CalculateAttendancePageProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [calculationResults, setCalculationResults] = useState<{
    summary: CalculationSummary;
    employeeResults: CalculationResult[];
  } | null>(null);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof CalculateAttendanceSchema>>({
    resolver: zodResolver(CalculateAttendanceSchema),
    defaultValues: {
      dateFrom: new Date(),
      dateTo: new Date(),
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user) return;

      setIsLoadingEmployees(true);
      try {
        const response = await axios.get(
          `/api/user/${user.userId}/activeEmployees`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees");
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [user]);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update toggleAll to work with filtered employees
  const toggleAllFilteredEmployees = () => {
    const filteredEmployeeIds = filteredEmployees.map((emp) => emp.userId);

    if (filteredEmployeeIds.every((id) => selectedEmployees.includes(id))) {
      // Deselect all filtered
      setSelectedEmployees((prev) =>
        prev.filter((id) => !filteredEmployeeIds.includes(id))
      );
    } else {
      // Select all filtered
      setSelectedEmployees((prev) => [
        ...new Set([...prev, ...filteredEmployeeIds]),
      ]);
    }
  };

  const handleSubmit = async (
    data: z.infer<typeof CalculateAttendanceSchema>
  ) => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/user/${user?.userId}/attendance/calculate`,
        {
          ...data,
          employeeIds: selectedEmployees,
        }
      );

      setCalculationResults(response.data);
      setShowResults(true);
      toast.success("Attendance record calculated successfully");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(
            error.response.data.error || "Failed to calculate attendance"
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmployee = (userId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp.userId));
    }
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Calculator className='mr-2 h-4 w-4' />
          Calculate Attendance
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Calculate Attendance Record'
        description='Select employees and date range to calculate attendance records.'
        fields={[
          {
            name: "dateFrom",
            label: "Start Date",
            type: "date",
          },
          {
            name: "dateTo",
            label: "End Date",
            type: "date",
          },
        ]}
        buttons={[
          {
            label: "Calculate",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setDialogOpen(false),
          },
        ]}
        onSubmit={handleSubmit}
        form={form}
        customContent={
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-medium'>Select Employees</h3>
              {/* <Button
                variant='outline'
                size='sm'
                onClick={toggleAllEmployees}
                className='h-8'
                type='button'
              >
                {selectedEmployees.length === employees.length
                  ? "Deselect All"
                  : "Select All"}
              </Button> */}
              <Button
                variant='outline'
                size='sm'
                onClick={toggleAllFilteredEmployees}
                className='h-8'
                type='button'
              >
                {filteredEmployees.length > 0 &&
                filteredEmployees.every((emp) =>
                  selectedEmployees.includes(emp.userId)
                )
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <div className='relative mb-3'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search employees...'
                className='pl-9'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoadingEmployees ? (
              <div className='flex justify-center py-4'>
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              </div>
            ) : (
              <ScrollArea className='h-[200px] rounded-md border p-2'>
                <div className='space-y-2'>
                  {/* {employees.map((employee) => (
                    <div
                      key={employee.userId}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={employee.userId}
                        checked={selectedEmployees.includes(employee.userId)}
                        onCheckedChange={() => toggleEmployee(employee.userId)}
                      />
                      <label
                        htmlFor={employee.userId}
                        className='flex-1 text-sm cursor-pointer flex justify-between'
                      >
                        <span>{employee.fullName}</span>
                        <span className='text-muted-foreground text-xs'>
                          {employee.department?.name || "No Department"}
                        </span>
                      </label>
                    </div>
                  ))}

                  {employees.length === 0 && (
                    <p className='text-center text-sm text-muted-foreground py-4'>
                      No active employees found
                    </p>
                  )} */}

                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.userId}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={employee.userId}
                        checked={selectedEmployees.includes(employee.userId)}
                        onCheckedChange={() => toggleEmployee(employee.userId)}
                      />
                      <label
                        htmlFor={employee.userId}
                        className='flex-1 text-sm cursor-pointer flex justify-between'
                      >
                        <span>{employee.fullName}</span>
                        <span className='text-muted-foreground text-xs'>
                          {employee.department?.name || "No Department"}
                        </span>
                      </label>
                    </div>
                  ))}

                  {filteredEmployees.length === 0 && (
                    <p className='text-center text-sm text-muted-foreground py-4'>
                      {employees.length === 0
                        ? "No active employees found"
                        : "No employees match your search"}
                    </p>
                  )}
                </div>
              </ScrollArea>
            )}

            {/* <div className='mt-2 text-xs text-muted-foreground'>
              {selectedEmployees.length} of {employees.length} employees
              selected
            </div> */}
            <div className='mt-2 text-xs text-muted-foreground'>
              {selectedEmployees.length} of {employees.length} employees
              selected
              {searchTerm && (
                <span> (showing {filteredEmployees.length} matches)</span>
              )}
            </div>
          </div>
        }
      >
        {showResults && calculationResults && (
          <div className='mt-6 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Calculation Summary</CardTitle>
                <CardDescription>
                  Results from {calculationResults.employeeResults.length}{" "}
                  employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <div className='flex flex-col gap-1 rounded-lg border p-3'>
                    <span className='text-sm text-muted-foreground'>
                      Total Days Checked
                    </span>
                    <span className='text-2xl font-bold'>
                      {calculationResults.summary.totalDaysChecked}
                    </span>
                  </div>
                  <div className='flex flex-col gap-1 rounded-lg border p-3'>
                    <span className='text-sm text-muted-foreground'>
                      Unauthorized Absences
                    </span>
                    <span className='text-2xl font-bold text-red-500'>
                      {calculationResults.summary.totalUnauthorizedAbsences}
                    </span>
                  </div>
                  <div className='flex flex-col gap-1 rounded-lg border p-3'>
                    <span className='text-sm text-muted-foreground'>
                      Late Arrivals
                    </span>
                    <span className='text-2xl font-bold text-amber-500'>
                      {calculationResults.summary.totalLateArrivals}
                    </span>
                  </div>
                  <div className='flex flex-col gap-1 rounded-lg border p-3'>
                    <span className='text-sm text-muted-foreground'>
                      Early Exits
                    </span>
                    <span className='text-2xl font-bold text-amber-500'>
                      {calculationResults.summary.totalEarlyExits}
                    </span>
                  </div>
                  <div className='flex flex-col gap-1 rounded-lg border p-3'>
                    <span className='text-sm text-muted-foreground'>
                      Leaves Deducted
                    </span>
                    <span className='text-2xl font-bold text-red-500'>
                      {calculationResults.summary.totalLeavesDeducted}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Employee Details</h3>
              {calculationResults.employeeResults.map((result) => (
                <Card key={result.userId}>
                  <CardHeader>
                    <CardTitle>{result.fullName}</CardTitle>
                    <CardDescription>
                      {result.totalDaysChecked} days checked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {result.unauthorizedAbsences.length > 0 && (
                        <div>
                          <h4 className='font-medium mb-2'>
                            Unauthorized Absences (
                            {result.unauthorizedAbsences.length})
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {result.unauthorizedAbsences.map((date) => (
                              <Badge key={date} variant='destructive'>
                                {date}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.lateArrivals.length > 0 && (
                        <div>
                          <h4 className='font-medium mb-2'>
                            Late Arrivals ({result.lateArrivals.length})
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {result.lateArrivals.map((date) => (
                              <Badge
                                key={date}
                                variant='outline'
                                className='bg-amber-100 text-amber-800 hover:bg-amber-200'
                              >
                                {date}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.earlyExits.length > 0 && (
                        <div>
                          <h4 className='font-medium mb-2'>
                            Early Exits ({result.earlyExits.length})
                          </h4>
                          <div className='flex flex-wrap gap-2'>
                            {result.earlyExits.map((date) => (
                              <Badge
                                key={date}
                                variant='outline'
                                className='bg-amber-100 text-amber-800 hover:bg-amber-200'
                              >
                                {date}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.leavesDeducted > 0 && (
                        <div className='mt-4 p-3 bg-red-50 rounded-md border border-red-200'>
                          <p className='text-red-700'>
                            <strong>{result.leavesDeducted} leave(s)</strong>{" "}
                            deducted due to {result.newLateCount} late arrivals
                            (Previous count: {result.previousLateCount})
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogForm>
    </>
  );
}
