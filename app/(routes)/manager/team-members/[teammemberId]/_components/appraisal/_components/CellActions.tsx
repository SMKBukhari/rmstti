"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DialogForm from "@/components/DialogForm";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppraisalRatingFormSchema } from "@/schemas";
import { Appraisal, Role, UserProfile } from "@prisma/client";
import { InterviewMarkingOptions } from "@/lib/data";

interface CellActionsProps {
  user: (UserProfile & { role: Role | null }) | null;
  userAppraisals: (UserProfile & { Appraisal: Appraisal[] }) | null;
  id: string;
  fullName: string;
  designation?: string;
  dob?: string;
  doj?: string;
  department: string;
}

const CellActions = ({
  user,
  id,
  fullName,
  department,
  designation,
  userAppraisals,
}: CellActionsProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAppraisal, setCurrentAppraisal] = useState<Appraisal | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (id && userAppraisals) {
      const currentApp = userAppraisals.Appraisal.find((app) => app.id === id);
      setCurrentAppraisal(currentApp || null);
    }
  }, [id, userAppraisals]);

  console.log("Current Appraisal:", currentAppraisal);

  const form = useForm<z.infer<typeof AppraisalRatingFormSchema>>({
    resolver: zodResolver(AppraisalRatingFormSchema),
    defaultValues: {
      employeeName: fullName ?? "",
      department: department ?? "",
      designation: designation ?? "",
      appraisalDate: currentAppraisal?.appraisalDate
        ? new Date(currentAppraisal.appraisalDate)
        : new Date(),
      appearance: currentAppraisal?.appearance || "N/A",
      intelligence: currentAppraisal?.intelligence || "N/A",
      relWithSupervisor: currentAppraisal?.relWithSupervisor || "N/A",
      relWithColleagues: currentAppraisal?.relWithColleagues || "N/A",
      teamWork: currentAppraisal?.teamWork || "N/A",
      abilityToCommunicateWrittenly:
        currentAppraisal?.abilityToCommunicateWrittenly || "N/A",
      abilityToCommunicateSpokenly:
        currentAppraisal?.abilityToCommunicateSpokenly || "N/A",
      integrityGeneral: currentAppraisal?.integrityGeneral || "N/A",
      integrityIntellectual: currentAppraisal?.integrityIntellectual || "N/A",
      dedicationToWork: currentAppraisal?.dedicationToWork || "N/A",
      reliability: currentAppraisal?.reliability || "N/A",
      responseUnderStressMentalPhysical:
        currentAppraisal?.responseUnderStressMentalPhysical || "N/A",
      willingnessToAcceptAddedResponsibility:
        currentAppraisal?.willingnessToAcceptAddedResponsibility || "N/A",
      initiative: currentAppraisal?.initiative || "N/A",
      financialAbility: currentAppraisal?.financialAbility || "N/A",
      professionalKnowledge: currentAppraisal?.professionalKnowledge || "N/A",
      creativeness: currentAppraisal?.creativeness || "N/A",
      abilityToTakeDecisions: currentAppraisal?.abilityToTakeDecisions || "N/A",
      tendencyToLearn: currentAppraisal?.tendencyToLearn || "N/A",
      abilityToPlanAndOrganizeWork:
        currentAppraisal?.abilityToPlanAndOrganizeWork || "N/A",
      optimalUseOfResources: currentAppraisal?.optimalUseOfResources || "N/A",
      outputRelativeToGoalsQuantity:
        currentAppraisal?.outputRelativeToGoalsQuantity || "N/A",
      outputRelativeToGoalsQuality:
        currentAppraisal?.outputRelativeToGoalsQuality || "N/A",
      analyticalAbility: currentAppraisal?.analyticalAbility || "N/A",
      appraisaledBy: user?.fullName || "N/A",
      appraisaledByDesignation: user?.designation || "N/A",
    },
  });

  useEffect(() => {
    if (currentAppraisal) {
      form.reset({
        employeeName: fullName ?? "",
        department: department ?? "",
        designation: designation ?? "",
        appraisalDate: currentAppraisal?.appraisalDate
          ? new Date(currentAppraisal.appraisalDate)
          : new Date(),
        appearance: currentAppraisal?.appearance || "N/A",
        intelligence: currentAppraisal?.intelligence || "N/A",
        relWithSupervisor: currentAppraisal?.relWithSupervisor || "N/A",
        relWithColleagues: currentAppraisal?.relWithColleagues || "N/A",
        teamWork: currentAppraisal?.teamWork || "N/A",
        abilityToCommunicateWrittenly:
          currentAppraisal?.abilityToCommunicateWrittenly || "N/A",
        abilityToCommunicateSpokenly:
          currentAppraisal?.abilityToCommunicateSpokenly || "N/A",
        integrityGeneral: currentAppraisal?.integrityGeneral || "N/A",
        integrityIntellectual: currentAppraisal?.integrityIntellectual || "N/A",
        dedicationToWork: currentAppraisal?.dedicationToWork || "N/A",
        reliability: currentAppraisal?.reliability || "N/A",
        responseUnderStressMentalPhysical:
          currentAppraisal?.responseUnderStressMentalPhysical || "N/A",
        willingnessToAcceptAddedResponsibility:
          currentAppraisal?.willingnessToAcceptAddedResponsibility || "N/A",
        initiative: currentAppraisal?.initiative || "N/A",
        financialAbility: currentAppraisal?.financialAbility || "N/A",
        professionalKnowledge: currentAppraisal?.professionalKnowledge || "N/A",
        creativeness: currentAppraisal?.creativeness || "N/A",
        abilityToTakeDecisions:
          currentAppraisal?.abilityToTakeDecisions || "N/A",
        tendencyToLearn: currentAppraisal?.tendencyToLearn || "N/A",
        abilityToPlanAndOrganizeWork:
          currentAppraisal?.abilityToPlanAndOrganizeWork || "N/A",
        optimalUseOfResources: currentAppraisal?.optimalUseOfResources || "N/A",
        outputRelativeToGoalsQuantity:
          currentAppraisal?.outputRelativeToGoalsQuantity || "N/A",
        outputRelativeToGoalsQuality:
          currentAppraisal?.outputRelativeToGoalsQuality || "N/A",
        analyticalAbility: currentAppraisal?.analyticalAbility || "N/A",
        appraisaledBy: user?.fullName || "N/A",
        appraisaledByDesignation: user?.designation || "N/A",
      });
    }
  }, [currentAppraisal, form, fullName, department, designation, user]);

  const onSubmit = async (data: z.infer<typeof AppraisalRatingFormSchema>) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `/api/user/${user?.userId}/appraisalRatingForm/update`,
        {
          id,
          ...data,
        }
      );
      console.log(data);
      toast.success(`Appraisal updated successfully for ${fullName}.`);
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
          <span>Update</span>
        )}
      </Button>

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
            label: "Update",
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
    </div>
  );
};

export default CellActions;
