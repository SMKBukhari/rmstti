"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DialogForm from "@/components/DialogForm";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScheduleInterviewSchema } from "@/schemas";
import { UserProfile } from "@prisma/client";

interface CellActionsProps {
  user: UserProfile | null;
  id: string;
  fullName: string;
  email: string;
}

const CellActions = ({ user, id, fullName, email }: CellActionsProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isRejection, setIsRejection] = useState(false);

  const form = useForm<z.infer<typeof ScheduleInterviewSchema>>({
    resolver: zodResolver(ScheduleInterviewSchema),
    defaultValues: {
      interviewDateTime: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof ScheduleInterviewSchema>) => {
    try {
      setIsLoading(true);
      const isoDateTime = data.interviewDateTime.toISOString() // Convert to ISO string
      await axios.post(`/api/user/${user?.userId}/scheduleAnInterview`, {
        applicantId: id,
        interviewDateTime: isoDateTime,
      });
      toast.success(`Interview scheduled successfully for ${fullName}.`);
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

  const onReject = async () => {
    try {
      setIsRejection(true);
      await axios.post(`/api/user/${user?.userId}/rejectJobApplication`, {
        applicantId: id,
        notifcationTitle: "Application Rejected", 
        notificationMessage: "Your Application has been rejected. Please try again later.",
      });
      toast.success(`Applicant ${fullName} rejected successfully.`);
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
      setIsRejection(false);
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
      >
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
        ) : (
          <span>Schedule</span>
        )}
      </Button>
      <Button variant={"destructive"} onClick={onReject}>
        {isRejection ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <span>Reject</span>
        )}
      </Button>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Schedule an Interview'
        description='Select a date and time for the interview.'
        fields={[
          {
            name: "interviewDateTime",
            type: "datetime",
          },
        ]}
        buttons={[
          {
            label: "Schedule",
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
