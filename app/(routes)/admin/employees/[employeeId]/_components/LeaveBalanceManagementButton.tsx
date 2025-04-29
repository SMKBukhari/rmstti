"use client";

import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeaveBalanceManagementSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface LeaveBalanceManagementButtonProps {
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

const LeaveBalanceManagementButton = ({
  user,
}: LeaveBalanceManagementButtonProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof LeaveBalanceManagementSchema>>({
    resolver: zodResolver(LeaveBalanceManagementSchema),
    defaultValues: {
      date: new Date(),
      entitledLeaves: "0",
      reason: "",
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

  const handleSubmit = async (
    data: z.infer<typeof LeaveBalanceManagementSchema>
  ) => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`/api/user/${user?.userId}/leaveBalanceManagement`, {
        ...data,
        employeeIds: selectedEmployees,
      });

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
      <div className='flex w-full items-end justify-end'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Plus className='w-5 h-5 mr-2' /> Entitled Leaves
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Entitled Leaves'
        description='Select employees to add entitled leaves.'
        fields={[
          {
            name: "date",
            label: "Date",
            type: "date",
          },
          {
            name: "entitledLeaves",
            label: "Entitled Leaves",
            type: "number",
            placeholder: "Enter number of entitled leaves",
          },
          {
            name: "reason",
            label: "Reason",
            type: "textarea",
            placeholder: "Enter reason for Entitled Leaves",
          },
        ]}
        buttons={[
          {
            label: "Entitle Leaves",
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
              <Button
                variant='outline'
                size='sm'
                onClick={toggleAllEmployees}
                className='h-8'
                type='button'
              >
                {selectedEmployees.length === employees.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            {isLoadingEmployees ? (
              <div className='flex justify-center py-4'>
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              </div>
            ) : (
              <ScrollArea className='h-[200px] rounded-md border p-2'>
                <div className='space-y-2'>
                  {employees.map((employee) => (
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
                  )}
                </div>
              </ScrollArea>
            )}

            <div className='mt-2 text-xs text-muted-foreground'>
              {selectedEmployees.length} of {employees.length} employees
              selected
            </div>
          </div>
        }
      ></DialogForm>
    </>
  );
};

export default LeaveBalanceManagementButton;
