"use client";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { InterviewMarkingOptions } from "@/lib/data";
import { AppraisalRatingFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department, Role, UserProfile } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddAppraisalProps {
  user: UserProfile | null;
  employee:
    | ((UserProfile & { role: Role | null }) & {
        department: Department | null;
      })
    | null;
}

const AddAppraisal = ({ user, employee }: AddAppraisalProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof AppraisalRatingFormSchema>>({
    resolver: zodResolver(AppraisalRatingFormSchema),
    defaultValues: {
      employeeName: employee?.fullName ?? "",
      department: employee?.department?.name ?? "",
      designation: employee?.designation ?? "",
      appraisalDate: new Date(),
      appearance: "N/A",
      intelligence: "N/A",
      relWithSupervisor: "N/A",
      relWithColleagues: "N/A",
      teamWork: "N/A",
      abilityToCommunicateWrittenly: "N/A",
      abilityToCommunicateSpokenly: "N/A",
      integrityGeneral: "N/A",
      integrityIntellectual: "N/A",
      dedicationToWork: "N/A",
      reliability: "N/A",
      responseUnderStressMentalPhysical: "N/A",
      willingnessToAcceptAddedResponsibility: "N/A",
      initiative: "N/A",
      financialAbility: "N/A",
      professionalKnowledge: "N/A",
      creativeness: "N/A",
      abilityToTakeDecisions: "N/A",
      tendencyToLearn: "N/A",
      abilityToPlanAndOrganizeWork: "N/A",
      optimalUseOfResources: "N/A",
      outputRelativeToGoalsQuantity: "N/A",
      outputRelativeToGoalsQuality: "N/A",
      analyticalAbility: "N/A",
      appraisaledBy: user?.fullName || "N/A",
      appraisaledByDesignation: user?.designation || "N/A",
    },
  });

  const onSubmit = async (data: z.infer<typeof AppraisalRatingFormSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/appraisalRatingForm`, {
        id: employee?.userId,
        ...data,
      });
      console.log(data);
      toast.success(`Appraisal Added successfully for ${employee?.fullName}.`);
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

  return (
    <>
      <div className='flex w-full items-end justify-end'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Plus className='w-5 h-5 mr-2' /> Add Appraisal
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Appraisal Rating Form'
        description='Please fill out the appraisal rating form for the employee.'
        fields={[
          {
            name: "employeeName",
            label: "Employee Name",
            type: "input",
            disabled: true,
          },
          {
            name: "appraisalDate",
            label: "Appraisal Date",
            type: "date",
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
            name: "appearance",
            label: "Appearance",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "intelligence",
            label: "Intelligence",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "relWithSupervisor",
            label: "Relationship with Supervisor",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "relWithColleagues",
            label: "Relationship with Colleagues",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "teamWork",
            label: "Team Work",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "abilityToCommunicateWrittenly",
            label: "Ability to Communicate Writtenly",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "abilityToCommunicateSpokenly",
            label: "Ability to Communicate Spokenly",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "integrityGeneral",
            label: "Integrity (General)",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "integrityIntellectual",
            label: "Integrity (Intellectual)",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "dedicationToWork",
            label: "Dedication to Work",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "reliability",
            label: "Reliability",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "responseUnderStressMentalPhysical",
            label: "Response Under Stress (Mental and Physical)",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "willingnessToAcceptAddedResponsibility",
            label: "Willingness to Accept Added Responsibility",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "initiative",
            label: "Initiative",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "financialAbility",
            label: "Financial Ability",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "professionalKnowledge",
            label: "Professional Knowledge",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "creativeness",
            label: "Creativeness",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "abilityToTakeDecisions",
            label: "Ability to Take Decisions",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "tendencyToLearn",
            label: "Tendency to Learn",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "abilityToPlanAndOrganizeWork",
            label: "Ability to Plan and Organize Work",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "optimalUseOfResources",
            label: "Optimal Use of Resources",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "outputRelativeToGoalsQuantity",
            label: "Output Relative to Goals (Quantity)",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "outputRelativeToGoalsQuality",
            label: "Output Relative to Goals (Quality)",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "analyticalAbility",
            label: "Analytical Ability",
            type: "select",
            comboboxOptions: InterviewMarkingOptions
              ? InterviewMarkingOptions
              : [],
          },
          {
            name: "appraisaledBy",
            label: "Appraised By (Your Name)",
            type: "input",
          },
          {
            name: "appraisaledByDesignation",
            label: "Appraised By Designation",
            type: "input",
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
        onSubmit={(data) => {
          onSubmit(data);
          setDialogOpen(false);
        }}
        form={form}
      />
    </>
  );
};

export default AddAppraisal;
