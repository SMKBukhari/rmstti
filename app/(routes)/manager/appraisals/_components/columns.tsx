"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Appraisal, Role, UserProfile } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import RemarksAction from "./RemarksAction";
import { ScoreGauge } from "@/components/global/ScoreGauge";

export type ApplicantsColumns = {
  user: (UserProfile & { role: Role | null }) | null;
  userAppraisals: (UserProfile & { Appraisal: Appraisal[] }) | null;
  id: string;
  appraisalDate: string;
  isAppraised: boolean;
  department: string;
  designation: string;
  fullName: string;
  dob: string;
  doj: string;
  appearance: string;
  intelligence: string;
  relWithSupervisor: string;
  relWithColleagues: string;
  teamWork: string;
  abilityToCommunicateWrittenly: string;
  abilityToCommunicateSpokenly: string;
  integrityGeneral: string;
  integrityIntellectual: string;
  dedicationToWork: string;
  reliability: string;
  responseUnderStressMentalPhysical: string;
  willingnessToAcceptAddedResponsibility: string;
  initiative: string;
  financialAbility: string;
  professionalKnowledge: string;
  creativeness: string;
  abilityToTakeDecisions: string;
  tendencyToLearn: string;
  abilityToPlanAndOrganizeWork: string;
  optimalUseOfResources: string;
  outputRelativeToGoalsQuantity: string;
  outputRelativeToGoalsQuality: string;
  analyticalAbility: string;
  commentsOnOverallPerformance: string;
  specificAdviceToTheEmployee: string;
  numberOfWarningLettersInThisContract: string;
  appraisaledBy: string;
  appraisaledByDesignation: string;
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "appraisaledBy",
    header: "Appraised By",
  },
  {
    accessorKey: "appraisaledByDesignation",
    header: "Appraised By Designation",
  },
  {
    accessorKey: "appraisalDate",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Appraisal Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      const { commentsOnOverallPerformance, specificAdviceToTheEmployee } =
        row.original;

      return (
        <div>
          <RemarksAction
            commentsOnOverallPerformance={commentsOnOverallPerformance}
            specificAdviceToTheEmployee={specificAdviceToTheEmployee}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        isAppraised,
        appearance,
        intelligence,
        relWithSupervisor,
        relWithColleagues,
        teamWork,
        abilityToCommunicateWrittenly,
        abilityToCommunicateSpokenly,
        integrityGeneral,
        integrityIntellectual,
        dedicationToWork,
        reliability,
        responseUnderStressMentalPhysical,
        willingnessToAcceptAddedResponsibility,
        initiative,
        financialAbility,
        professionalKnowledge,
        creativeness,
        abilityToTakeDecisions,
        tendencyToLearn,
        abilityToPlanAndOrganizeWork,
        optimalUseOfResources,
        outputRelativeToGoalsQuantity,
        outputRelativeToGoalsQuality,
        analyticalAbility,
        numberOfWarningLettersInThisContract,
      } = row.original;
      if (isAppraised) {
        const criteria = {
          appearance,
          intelligence,
          relWithSupervisor,
          relWithColleagues,
          teamWork,
          abilityToCommunicateWrittenly,
          abilityToCommunicateSpokenly,
          integrityGeneral,
          integrityIntellectual,
          dedicationToWork,
          reliability,
          responseUnderStressMentalPhysical,
          willingnessToAcceptAddedResponsibility,
          initiative,
          financialAbility,
          professionalKnowledge,
          creativeness,
          abilityToTakeDecisions,
          tendencyToLearn,
          abilityToPlanAndOrganizeWork,
          optimalUseOfResources,
          outputRelativeToGoalsQuantity,
          outputRelativeToGoalsQuality,
          analyticalAbility,
          numberOfWarningLettersInThisContract,
        };

        const criteriaWeightage = {
          appearance: 5,
          intelligence: 10,
          relWithSupervisor: 5,
          relWithColleagues: 5,
          teamWork: 10,
          abilityToCommunicateWrittenly: 5,
          abilityToCommunicateSpokenly: 5,
          integrityGeneral: 5,
          integrityIntellectual: 5,
          dedicationToWork: 5,
          reliability: 5,
          responseUnderStressMentalPhysical: 5,
          willingnessToAcceptAddedResponsibility: 5,
          initiative: 5,
          financialAbility: 5,
          professionalKnowledge: 10,
          creativeness: 5,
          abilityToTakeDecisions: 5,
          tendencyToLearn: 5,
          abilityToPlanAndOrganizeWork: 10,
          optimalUseOfResources: 5,
          outputRelativeToGoalsQuantity: 10,
          outputRelativeToGoalsQuality: 10,
          analyticalAbility: 5,
          // numberOfWarningLettersInThisContract: 30,
        };

        // const validCriteria = Object.values(criteria).filter(
        //   (value) => value !== "N/A"
        // );

        const validCriteria = Object.entries(criteria).filter(
          ([_, value]) => value !== "N/A"
        );

        // const obtainedPoints = validCriteria.reduce(
        //   (total, value) => total + parseInt(value || "0"),
        //   0
        // );

        let { obtainedPoints, totalPoints } = validCriteria.reduce(
          (acc, [key, value]) => {
            const weight =
              criteriaWeightage[key as keyof typeof criteriaWeightage] || 5;
            return {
              obtainedPoints: acc.obtainedPoints + parseInt(value || "0"),
              totalPoints: acc.totalPoints + weight,
            };
          },
          { obtainedPoints: 0, totalPoints: 0 }
        );
        // const totalPoints = validCriteria.length * 5; // Assuming each criterion is out of 5 points
        if (numberOfWarningLettersInThisContract !== "N/A") {
          totalPoints = totalPoints - 5;
        }
        const percentage = (obtainedPoints / totalPoints) * 100;

        return (
          <div className='flex gap-5'>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`md:h-10 mr-5 h-8 px-2 text-lg font-bold flex items-center justify-center rounded-md ${
                    percentage >= 80
                      ? "text-green-500 bg-green-200"
                      : percentage >= 40
                      ? "text-yellow-600 bg-yellow-200"
                      : "text-red-500 bg-red-300"
                  }
              `}
                >
                  {/* {obtainedPoints}/{totalPoints} */}
                  {percentage.toFixed(2) + " %"}
                </div>
              </TooltipTrigger>
              <TooltipContent draggable>
                {isAppraised && (
                  <ScrollArea>
                    <div className='mt-4'>
                      <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider mb-4'>
                        Appraisal Score
                      </h3>
                      <ScoreGauge
                        score={obtainedPoints}
                        maxScore={totalPoints}
                      />
                    </div>
                  </ScrollArea>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      }
    },
  },
];
