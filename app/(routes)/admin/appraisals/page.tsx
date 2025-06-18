import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import React from "react";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";
import { cookies } from "next/headers";

const AppraisalPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
    },
  });

  const appraisals = await db.appraisal.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      user: {
        include: {
          department: true,
          Appraisal: true,
        },
      },
    },
  });

  // Formatting the applicants data for the table
  const formattedApplicants: ApplicantsColumns[] = appraisals.map(
    (appraisal) => ({
      user: user,
      userAppraisals: appraisal.user,
      department: appraisal.user?.department?.name || "N/A",
      fullName: appraisal.user?.fullName || "N/A",
      designation: appraisal.user?.designation || "N/A",
      dob: appraisal.user?.DOB
        ? format(new Date(appraisal.user.DOB), "MMMM do, yyyy")
        : "N/A",
      doj: appraisal.user?.DOJ
        ? format(new Date(appraisal.user.DOJ), "MMMM do, yyyy")
        : "N/A",
      id: appraisal?.id ?? "N/A",
      appraisalDate: appraisal.appraisalDate
        ? format(new Date(appraisal.appraisalDate), "MMMM do, yyyy")
        : "N/A",
      isAppraised: appraisal.isAppraised || false,
      appearance: appraisal.appearance || "N/A",
      intelligence: appraisal.intelligence || "N/A",
      relWithSupervisor: appraisal.relWithSupervisor || "N/A",
      relWithColleagues: appraisal.relWithColleagues || "N/A",
      teamWork: appraisal.teamWork || "N/A",
      abilityToCommunicateWrittenly:
        appraisal.abilityToCommunicateWrittenly || "N/A",
      abilityToCommunicateSpokenly:
        appraisal.abilityToCommunicateSpokenly || "N/A",
      integrityGeneral: appraisal.integrityGeneral || "N/A",
      integrityIntellectual: appraisal.integrityIntellectual || "N/A",
      dedicationToWork: appraisal.dedicationToWork || "N/A",
      reliability: appraisal.reliability || "N/A",
      responseUnderStressMentalPhysical:
        appraisal.responseUnderStressMentalPhysical || "N/A",
      willingnessToAcceptAddedResponsibility:
        appraisal.willingnessToAcceptAddedResponsibility || "N/A",
      initiative: appraisal.initiative || "N/A",
      financialAbility: appraisal.financialAbility || "N/A",
      professionalKnowledge: appraisal.professionalKnowledge || "N/A",
      creativeness: appraisal.creativeness || "N/A",
      abilityToTakeDecisions: appraisal.abilityToTakeDecisions || "N/A",
      tendencyToLearn: appraisal.tendencyToLearn || "N/A",
      abilityToPlanAndOrganizeWork:
        appraisal.abilityToPlanAndOrganizeWork || "N/A",
      optimalUseOfResources: appraisal.optimalUseOfResources || "N/A",
      outputRelativeToGoalsQuantity:
        appraisal.outputRelativeToGoalsQuantity || "N/A",
      outputRelativeToGoalsQuality:
        appraisal.outputRelativeToGoalsQuality || "N/A",
      analyticalAbility: appraisal.analyticalAbility || "N/A",
      numberOfWarningLettersInThisContract:
        appraisal.numberOfWarningLettersInThisContract || "N/A",
      appraisaledBy: appraisal.appraisaledBy || "N/A",
      appraisaledByDesignation: appraisal.appraisaledByDesignation || "N/A",
      commentsOnOverallPerformance:
        appraisal.commentsOnOverallPerformance || "No remarks provided.",
      specificAdviceToTheEmployee:
        appraisal.specificAdviceToTheEmployee || "No advice provided.",
    })
  );

  return (
    <div className='mt-6 space-y-5 w-full'>
      <DataTable columns={columns} data={formattedApplicants} />
    </div>
  );
};

export default AppraisalPage;
