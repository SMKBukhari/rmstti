"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserProfile, WorkStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import DialogForm from "@/components/DialogForm";
import { UpdateAttendanceStatusSchema } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CellActionsProps {
  user: UserProfile | null;
  workStatus: WorkStatus[] | null;
  id: string;
  status: string;
  fullName: string;
}

const CellActions = ({
  user,
  id,
  workStatus,
  status,
  fullName,
}: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateAttendanceStatusSchema>>({
    resolver: zodResolver(UpdateAttendanceStatusSchema),
    defaultValues: {
      status: status,
    },
  });

  const onSubmit = async (
    data: z.infer<typeof UpdateAttendanceStatusSchema>
  ) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `/api/user/${user?.userId}/attendance/${id}/updateStatus`,
        { status: data.status }
      );
      toast.success(`Work status of ${fullName} has been updated.`);
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
      setIsLoading(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the row
  };

  return (
    <div className='flex gap-3' onClick={handleButtonClick}>
      <Button
        variant={"outline"}
        className='bg-transparent border-white'
        onClick={() => setDialogOpen(true)}
        disabled={status === "Approved"}
      >
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
        ) : (
          <span>Update Work Status</span>
        )}
      </Button>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Update Work Status'
        description='Update the work status of the employee.'
        fields={[
          {
            name: "status",
            label: "Status",
            type: "select",
            comboboxOptions: workStatus
              ? workStatus.map((w) => ({ label: w.name, value: w.name }))
              : [],
          },
        ]}
        buttons={[
          {
            label: "Submit",
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
    </div>
  );
};

export default CellActions;
