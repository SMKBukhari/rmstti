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
import { WarningSchema } from "@/schemas";
import { UserProfile } from "@prisma/client";

interface CellActionsProps {
  user: UserProfile | null;
  id: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  role: string;
  company: string;
}

const CellActions = ({
  user,
  id,
  fullName,
  role,
  department,
  designation,
  company,
}: CellActionsProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isWarning, setIsWarning] = useState(false);

  const defaultWarningMessage = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 40px;">
    <div style="margin-bottom: 30px;">
      <p style="font-size: 18px; font-weight: bold;">Dear ${fullName},</p>
    </div>

    <div style="margin-bottom: 30px; text-align: justify;">
      <p>
        This letter serves as a formal warning regarding your recent behavior/performance. It has come to our attention that
        <strong>[Insert specific issue or behavior here]</strong> has been affecting your work and the team's productivity.
      </p>
      <p>
        As a valued member of <strong>${company}</strong>, we urge you to address this matter immediately to ensure
        that we can continue to work together productively. Please note that further issues may result in more severe actions.
      </p>
    </div>

    <div style="margin-bottom: 40px; text-align: justify;">
      <p>
        We trust that you will take the necessary steps to correct this situation. If you need any clarification, or if you would
        like to discuss this matter further, please don't hesitate to reach out.
      </p>
    </div>
  </div>
`;

  const WarningForm = useForm<z.infer<typeof WarningSchema>>({
    resolver: zodResolver(WarningSchema),
    defaultValues: {
      fullName: fullName,
      role: role,
      department: department,
      designation: designation,
      senderName: user?.fullName ?? "N/A",
      senderDesignation: user?.designation ?? "N/A",
      title: "",
      warningMessage: defaultWarningMessage,
    },
  });

  const onTerminate = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/terminateEmployee`, {
        id: id,
      });
      toast.success(`Employee ${fullName} terminated successfully.`);
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

  // Send warning to employee
  const onWarning = async (data: z.infer<typeof WarningSchema>) => {
    try {
      setIsWarning(true);
      await axios.post(`/api/user/${user?.userId}/warnEmployee`, {
        id: id,
        fullName: data.fullName,
        role: data.role,
        department: data.department,
        designation: data.designation,
        senderName: data.senderName,
        senderDesignation: data.senderDesignation,
        title: data.title,
        warningMessage: data.warningMessage,
      });
      toast.success(`Warning sent to ${fullName}.`);
      setDialogOpen(false);
      setIsWarning(false);
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
      setIsWarning(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the row
  };

  return (
    <div className='flex gap-3' onClick={handleButtonClick}>
      {/* Warning Button */}
      <Button
        variant={"default"}
        className='bg-yellow-300 hover:bg-yellow-400 text-yellow-700 border-white'
        onClick={() => setDialogOpen(true)}
      >
        {isWarning ? (
          <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
        ) : (
          <span>Warning</span>
        )}
      </Button>

      {/* Terminate Button */}
      <Button variant={"destructive"} onClick={onTerminate}>
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <span>Terminate</span>
        )}
      </Button>

      {/* Warning Dialog Form */}
      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Send Warning'
        description='Please enter the warning message.'
        fields={[
          {
            name: "fullName",
            label: "Full Name",
            type: "input",
            disabled: true,
          },
          {
            name: "role",
            label: "Role",
            type: "input",
            disabled: true,
          },
          {
            name: "department",
            label: "Department",
            type: "input",
            disabled: true,
          },
          {
            name: "designation",
            label: "Designation",
            type: "input",
            disabled: true,
          },
          {
            name: "senderName",
            label: "Sender Name",
            type: "input",
            disabled: true,
          },
          {
            name: "senderDesignation",
            label: "Sender Designation",
            type: "input",
            disabled: true,
          },
          {
            name: "title",
            label: "Title",
            type: "input",
            placeholder: "Enter the title of the warning",
          },
          {
            name: "warningMessage",
            label: "Warning Message",
            type: "richtextarea",
          },
        ]}
        buttons={[
          {
            label: "Send Warning",
            type: "submit",
            variant: "primary",
            isLoading: isWarning,
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setDialogOpen(false),
          },
        ]}
        onSubmit={onWarning}
        form={WarningForm}
      />
    </div>
  );
};

export default CellActions;
