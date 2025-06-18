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
import {
  addAppraisalFormFields,
  addAppraisalFormFieldsApproved,
  AppraisalField,
} from "@/lib/dialogFields";

interface CellActionsProps {
  user: (UserProfile & { role: Role | null }) | null;
  userAppraisals: (UserProfile & { Appraisal: Appraisal[] }) | null;
  id: string;
  fullName: string;
  designation?: string;
  dob?: string;
  doj?: string;
  department: string;
  isApproved: boolean;
}

const CellActions = ({
  user,
  id,
  fullName,
  department,
  designation,
  userAppraisals,
  isApproved,
}: CellActionsProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSecondDialogOpen, setSecondDialogOpen] = useState(false);
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
      numberOfWarningLettersInThisContract:
        currentAppraisal?.numberOfWarningLettersInThisContract || "N/A",
      commentsOnJobDescription:
        currentAppraisal?.commentsOnJobDescription || "N/A",
      commentsOnOverallPerformance:
        currentAppraisal?.commentsOnOverallPerformance || "N/A",
      specificAdviceToTheEmployee:
        currentAppraisal?.specificAdviceToTheEmployee || "N/A",
      remarksByHR: currentAppraisal?.remarksByHR || "N/A",
      remarksByCEO: currentAppraisal?.remarksByCEO || "N/A",
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
        numberOfWarningLettersInThisContract:
          currentAppraisal?.numberOfWarningLettersInThisContract || "N/A",
        commentsOnJobDescription:
          currentAppraisal.commentsOnJobDescription || "N/A",
        commentsOnOverallPerformance:
          currentAppraisal.commentsOnOverallPerformance || "N/A",
        specificAdviceToTheEmployee:
          currentAppraisal.specificAdviceToTheEmployee || "N/A",
        remarksByHR: currentAppraisal.remarksByHR || "N/A",
        remarksByCEO: currentAppraisal.remarksByCEO || "N/A",
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

  const onApprove = async () => {
    try {
      setIsLoading(true);
      await axios.patch(
        `/api/user/${user?.userId}/appraisalRatingForm/approve`,
        { id }
      );
      toast.success(`Appraisal Approved successfully for ${fullName}.`);
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
      {!isApproved && (
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
      )}

      {isApproved && (
        <Button
          variant={"outline"}
          className='bg-transparent dark:border-white border-black'
          onClick={() => setSecondDialogOpen(true)}
        >
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
          ) : (
            <span>View</span>
          )}
        </Button>
      )}

      {!isApproved && (
        <Button
          variant={"primary"}
          className='bg-transparent dark:border-white border-black'
          onClick={() => onApprove()}
        >
          {isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
          ) : (
            <span>Approve</span>
          )}
        </Button>
      )}

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Appraisal Rating Form'
        description='Please fill out the appraisal rating form for the employee.'
        fields={addAppraisalFormFields.map((field: AppraisalField) => ({
          name: field.name,
          label: field.label,
          type: field.type,
          comboboxOptions: field.comboboxOptions,
        }))}
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

      <DialogForm
        isOpen={isSecondDialogOpen}
        onOpenChange={setSecondDialogOpen}
        title='Appraisal Rating Form'
        description='You can see the appraisal rating form for the employee.'
        fields={addAppraisalFormFieldsApproved.map((field: AppraisalField) => ({
          name: field.name,
          label: field.label,
          type: field.type,
          comboboxOptions: field.comboboxOptions,
          disabled: true,
        }))}
        buttons={[
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
