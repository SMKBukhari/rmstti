import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;
    const {
      id,
      appraisalDate,
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
      commentsOnJobDescription,
      commentsOnOverallPerformance,
      specificAdviceToTheEmployee,
      remarksByHR,
      remarksByCEO,
      appraisaledBy,
      appraisaledByDesignation,
    } = await req.json();

    // Get the user profile
    const user = await db.userProfile.findFirst({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const existingAppraisal = db.appraisal.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingAppraisal) {
      return new NextResponse("Appraisal with this ID not found", {
        status: 404,
      });
    }

    const addAppraisal = await db.appraisal.update({
      where: {
        id: id,
      },
      data: {
        appraisalDate: appraisalDate ? new Date(appraisalDate) : new Date(),
        appraisaledBy: appraisaledBy || user.fullName,
        appraisaledByDesignation: appraisaledByDesignation || user.designation,
        appearance: appearance,
        intelligence: intelligence,
        relWithSupervisor: relWithSupervisor,
        relWithColleagues: relWithColleagues,
        teamWork: teamWork,
        abilityToCommunicateWrittenly: abilityToCommunicateWrittenly,
        abilityToCommunicateSpokenly: abilityToCommunicateSpokenly,
        integrityGeneral: integrityGeneral,
        integrityIntellectual: integrityIntellectual,
        dedicationToWork: dedicationToWork,
        reliability: reliability,
        responseUnderStressMentalPhysical: responseUnderStressMentalPhysical,
        willingnessToAcceptAddedResponsibility:
          willingnessToAcceptAddedResponsibility,
        initiative: initiative,
        financialAbility: financialAbility,
        professionalKnowledge: professionalKnowledge,
        creativeness: creativeness,
        abilityToTakeDecisions: abilityToTakeDecisions,
        tendencyToLearn: tendencyToLearn,
        abilityToPlanAndOrganizeWork: abilityToPlanAndOrganizeWork,
        optimalUseOfResources: optimalUseOfResources,
        outputRelativeToGoalsQuantity: outputRelativeToGoalsQuantity,
        outputRelativeToGoalsQuality: outputRelativeToGoalsQuality,
        analyticalAbility: analyticalAbility,
        numberOfWarningLettersInThisContract:
          numberOfWarningLettersInThisContract,
        commentsOnJobDescription: commentsOnJobDescription,
        commentsOnOverallPerformance: commentsOnOverallPerformance,
        specificAdviceToTheEmployee: specificAdviceToTheEmployee,
        remarksByHR: remarksByHR,
        remarksByCEO: remarksByCEO,
      },
    });

    return NextResponse.json({
      message: "Appraisal Updated Successfully",
      addAppraisal,
    });
  } catch (error) {
    console.error(`ADD_APPRAISAL_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
