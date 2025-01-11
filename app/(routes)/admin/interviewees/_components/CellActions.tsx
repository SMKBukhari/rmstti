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
import { InterviewRatingFormSchema } from "@/schemas";
import { Role, UserProfile } from "@prisma/client";

interface CellActionsProps {
  user: (UserProfile & { role: Role | null }) | null;
  id: string;
  fullName: string;
  email: string;
  appliedFor: string;
}

const CellActions = ({
  user,
  id,
  fullName,
  appliedFor,
}: CellActionsProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isRejection, setIsRejection] = useState(false);

  const form = useForm<z.infer<typeof InterviewRatingFormSchema>>({
    resolver: zodResolver(InterviewRatingFormSchema),
    defaultValues: {
      candidateName: fullName,
      personality: "0",
      appearance: "0",
      communication: "0",
      reasoning: "0",
      education: "0",
      jobKnowledge: "0",
      workExperience: "0",
      generalKnowledge: "0",
      iq: "0",
      pose: "0",
      salaryExpectations: "",
      strengths: "",
      weaknesses: "",
      remarks: "",
      interviewDate: new Date(),
      positionApplied: appliedFor,
      interviewerName: user?.fullName ?? "",
      interviewerDesignation: user?.role?.name ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof InterviewRatingFormSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/interviewRatingForm`, {
        id,
        ...data,
      });
      console.log(data);
      toast.success(`Interview updated successfully for ${fullName}.`);
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
        notificationMessage:
          "Your Application has been rejected. Please try again later.",
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
        className='bg-transparent dark:border-white border-black'
        onClick={() => setDialogOpen(true)}
      >
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
        ) : (
          <span>Interview</span>
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
        title='Interview Rating Form'
        description='Fill out the interview rating form for the applicant.'
        fields={[
          {
            name: "candidateName",
            label: "Candidate Name",
            placeholder: "Enter candidate name",
            type: "input",
            disabled: true,
          },
          {
            name: "interviewDate",
            label: "Interview Date",
            type: "date",
          },
          {
            name: "positionApplied",
            label: "Position Applied For",
            type: "input",
            disabled: true,
          },
          {
            name: "appearance",
            label: "Appearance/Mannerism",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "communication",
            label: "Communication/Presentation skills",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "reasoning",
            label: "Reasoning and Judgment",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "education",
            label: "Education",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "jobKnowledge",
            label: "Job/Subject Knowledge",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "workExperience",
            label: "Work Experience",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "generalKnowledge",
            label: "General Knowledge",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "iq",
            label: "I.Q.",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "pose",
            label: "Pose & Maturity",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "personality",
            label: "Personality, Attitudes and Social adjustment",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "salaryExpectations",
            label: "Salary Expectations",
            type: "input",
          },
          {
            name: "strengths",
            label: "Strengths for this job",
            type: "textarea",
          },
          {
            name: "weaknesses",
            label: "Weakness for this job",
            type: "textarea",
          },
          { name: "remarks", label: "Remarks", type: "textarea" },
          { name: "interviewerName", label: "Interviewer Name", type: "input" },
          {
            name: "interviewerDesignation",
            label: "Interviewer Designation",
            type: "input",
          },
        ]}
        buttons={[
          {
            label: "Submit and Generate PDF",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
            // onClick: () => {
            //   onSubmit(form.getValues());
            // },
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
