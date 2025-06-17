"use client";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { addAppraisalFormFields, AppraisalField } from "@/lib/dialogFields";
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
      numberOfWarningLettersInThisContract: "N/A",
      commentsOnJobDescription: "N/A",
      commentsOnOverallPerformance: "N/A",
      specificAdviceToTheEmployee: "N/A",
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
        fields={addAppraisalFormFields.map((field: AppraisalField) => ({
          name: field.name,
          label: field.label,
          type: field.type,
          comboboxOptions: field.comboboxOptions,
        }))}
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
