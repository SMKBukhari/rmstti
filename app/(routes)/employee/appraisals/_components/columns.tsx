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
import { ScoreGauge } from "./ScoreGauge";
import { ScrollArea } from "@/components/ui/scroll-area";
import RemarksAction from "./RemarksAction";

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
  appearanceRemarks?: string;
  intelligence: string;
  intelligenceRemarks?: string;
  relWithSupervisor: string;
  relWithSupervisorRemarks?: string;
  relWithColleagues: string;
  relWithColleaguesRemarks?: string;
  teamWork: string;
  teamWorkRemarks?: string;
  abilityToCommunicateWrittenly: string;
  abilityToCommunicateWrittenlyRemarks?: string;
  abilityToCommunicateSpokenly: string;
  abilityToCommunicateSpokenlyRemarks?: string;
  integrityGeneral: string;
  integrityGeneralRemarks?: string;
  integrityIntellectual: string;
  integrityIntellectualRemarks?: string;
  dedicationToWork: string;
  dedicationToWorkRemarks?: string;
  reliability: string;
  reliabilityRemarks?: string;
  responseUnderStressMentalPhysical: string;
  responseUnderStressMentalPhysicalRemarks?: string;
  willingnessToAcceptAddedResponsibility: string;
  willingnessToAcceptAddedResponsibilityRemarks?: string;
  initiative: string;
  initiativeRemarks?: string;
  financialAbility: string;
  financialAbilityRemarks?: string;
  professionalKnowledge: string;
  professionalKnowledgeRemarks?: string;
  creativeness: string;
  creativenessRemarks?: string;
  abilityToTakeDecisions: string;
  abilityToTakeDecisionsRemarks?: string;
  tendencyToLearn: string;
  tendencyToLearnRemarks?: string;
  abilityToPlanAndOrganizeWork: string;
  abilityToPlanAndOrganizeWorkRemarks?: string;
  optimalUseOfResources: string;
  optimalUseOfResourcesRemarks?: string;
  outputRelativeToGoalsQuantity: string;
  outputRelativeToGoalsQuantityRemarks?: string;
  outputRelativeToGoalsQuality: string;
  outputRelativeToGoalsQualityRemarks?: string;
  analyticalAbility: string;
  analyticalAbilityRemarks?: string;
  commentsOnOverallPerformance: string;
  specificAdviceToTheEmployee: string;
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
        };

        const validCriteria = Object.values(criteria).filter(
          (value) => value !== "N/A"
        );

        const obtainedPoints = validCriteria.reduce(
          (total, value) => total + parseInt(value || "0"),
          0
        );
        const totalPoints = validCriteria.length * 5; // Assuming each criterion is out of 5 points
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
