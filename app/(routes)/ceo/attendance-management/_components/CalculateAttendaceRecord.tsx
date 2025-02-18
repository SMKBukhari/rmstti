"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { UserProfile } from "@prisma/client";
import { Calculator } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { CalculateAttendanceSchema } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DialogForm from "@/components/DialogForm";

interface CalculateAttendancePageProps {
  user: UserProfile | null;
}

export default function CalculateAttendancePage({
  user,
}: CalculateAttendancePageProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CalculateAttendanceSchema>>({
    resolver: zodResolver(CalculateAttendanceSchema),
    defaultValues: {
      dateFrom: new Date(),
      dateTo: new Date(),
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof CalculateAttendanceSchema>
  ) => {
    setIsLoading(true);
    try {
      //   Implement the Calculate Attendance Record logic here
      const dates = await axios.post(`/api/user/${user?.userId}/attendance/calculate`, {
        ...data,
      });
      toast.success("Attendance record calculated successfully");
      setDialogOpen(false);
      setIsLoading(false);
      router.refresh();
      console.log(dates);
      router.push("/admin/attendance-management");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setDialogOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className=''>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Calculator />
          Calculate Attendance
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Calculate Attendance Record'
        description='Please fill in the details below to calculate the attendance record.'
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
      />
    </>
  );
}
