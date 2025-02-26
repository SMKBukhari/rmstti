"use client";

import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { WorkFromHomeRequestSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface RaiseRequestProps {
  user: UserProfile | null;
}

const RaiseRequest = ({ user }: RaiseRequestProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof WorkFromHomeRequestSchema>>({
    resolver: zodResolver(WorkFromHomeRequestSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof WorkFromHomeRequestSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/workFromHomeRequests`, {
        ...data,
      });
      console.log(data);
      toast.success(`Work From Home request raised successfully.`);
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
      <div className='flex w-full items-end justify-end mt-6'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Plus className='w-5 h-5 mr-2' /> Raise Request
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Raise a Work From Home Request'
        description='Please fill out the form below to raise a work from home request.'
        fields={[
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
