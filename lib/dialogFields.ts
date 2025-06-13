import { AppraisalRatingFormSchema } from "@/schemas";
import { z } from "zod";

export const AppraisalMarkingOptions = [
  { label: "N/A", value: "N/A" },
  { label: "Poor (1)", value: "1" },
  { label: "Average (2)", value: "2" },
  { label: "Good (3)", value: "3" },
  { label: "V. Good (4)", value: "4" },
  { label: "Excellent (5)", value: "5" },
];

export type AppraisalField = {
  name: keyof z.infer<typeof AppraisalRatingFormSchema>;
  label: string;
  type:
    | "number"
    | "input"
    | "select"
    | "date"
    | "textarea"
    | "checkbox"
    | "richtextarea"
    | "datetime"
    | "switchButton"
    | "time"
    | "file";
  disabled?: boolean;
  comboboxOptions?: { label: string; value: string }[];
  maxLength?: number;
};

export const addAppraisalFormFields: AppraisalField[] = [
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
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "intelligence",
    label: "Intelligence",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "relWithSupervisor",
    label: "Relationship with Supervisor",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "relWithColleagues",
    label: "Relationship with Colleagues",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "teamWork",
    label: "Team Work",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "abilityToCommunicateWrittenly",
    label: "Ability to Communicate Writtenly",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "abilityToCommunicateSpokenly",
    label: "Ability to Communicate Spokenly",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "integrityGeneral",
    label: "Integrity (General)",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "integrityIntellectual",
    label: "Integrity (Intellectual)",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "dedicationToWork",
    label: "Dedication to Work",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "reliability",
    label: "Reliability",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "responseUnderStressMentalPhysical",
    label: "Response Under Stress (Mental and Physical)",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "willingnessToAcceptAddedResponsibility",
    label: "Willingness to Accept Added Responsibility",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "initiative",
    label: "Initiative",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "financialAbility",
    label: "Financial Ability",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "professionalKnowledge",
    label: "Professional Knowledge",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "creativeness",
    label: "Creativeness",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "abilityToTakeDecisions",
    label: "Ability to Take Decisions",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "tendencyToLearn",
    label: "Tendency to Learn",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "abilityToPlanAndOrganizeWork",
    label: "Ability to Plan and Organize Work",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "optimalUseOfResources",
    label: "Optimal Use of Resources",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "outputRelativeToGoalsQuantity",
    label: "Output Relative to Goals (Quantity)",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "outputRelativeToGoalsQuality",
    label: "Output Relative to Goals (Quality)",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "analyticalAbility",
    label: "Analytical Ability",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "commentsOnJobDescription",
    label: "Comments On Job Description",
    type: "textarea",
  },
  {
    name: "commentsOnOverallPerformance",
    label: "Comments On Overall Performance",
    type: "textarea",
  },
  {
    name: "specificAdviceToTheEmployee",
    label: "Specific Advice to the Employee",
    type: "textarea",
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
];
