"use client";

import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { LeaveRequestSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeaveType, UserProfile } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface RaiseRequestProps {
  leaveType: LeaveType[] | null;
  user: UserProfile | null;
}

const RaiseRequest = ({ leaveType, user }: RaiseRequestProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LeaveRequestSchema>>({
    resolver: zodResolver(LeaveRequestSchema),
    defaultValues: {
      leaveType: "",
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LeaveRequestSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/adminLeaveManagement`, {
        ...data,
      });
      console.log(data);
      toast.success(`Leave request raised successfully.`);
      setDialogOpen(false);
      setIsLoading(false);
      router.refresh();
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
      <div className='flex w-full items-end justify-end'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Plus className='w-5 h-5 mr-2' /> Raise Request
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Raise a Leave Request'
        description='Please fill in the details below to raise a leave request.'
        fields={[
          {
            name: "leaveType",
            label: "Leave Type",
            type: "select",
            comboboxOptions: leaveType
              ? leaveType.map((type) => ({
                  label: type.name,
                  value: type.name,
                }))
              : [],
          },
          {
            name: "startDate",
            label: "Start Date",
            type: "date",
          },
          {
            name: "endDate",
            label: "End Date",
            type: "date",
          },
          {
            name: "reason",
            label: "Reason",
            type: "textarea",
          },
        ]}
        buttons={[
          {
            label: "Submit Request",
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
        onSubmit={onSubmit}
        form={form}
      />
    </>
  );
};

export default RaiseRequest;
