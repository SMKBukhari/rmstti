"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import CellActions from "./CellActions";
import { Role, UserProfile } from "@prisma/client";

export type ApplicantsColumns = {
  user: (UserProfile & { role: Role | null }) | null;
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
  appraisaledBy: string;
  appraisaledByDesignation: string;
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
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
    id: "actions",
    cell: ({ row }) => {
      const {
        department,
        fullName,
        designation,
        dob,
        doj,
        isAppraised,
        user,
        id,
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
          <div className="flex gap-5">
            <div
              className={`w-16 md:h-10 h-8 px-2 text-lg font-bold flex items-center justify-center rounded-md ${
                percentage >= 80
                  ? "text-green-500 bg-green-200"
                  : percentage >= 40
                  ? "text-yellow-600 bg-yellow-200"
                  : "text-red-500 bg-red-300"
              }
              `}
            >
              {obtainedPoints}/{totalPoints}
            </div>

            <CellActions
              user={user}
              id={id}
              fullName={fullName}
              department={department}
              designation={designation}
              dob={dob}
              doj={doj}
            />
          </div>
        );
      }
    },
  },
];
