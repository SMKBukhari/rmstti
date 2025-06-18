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

export const AppraisalMarkingOptions2 = [
  { label: "N/A", value: "N/A" },
  { label: "Poor (2)", value: "2" },
  { label: "Average (4)", value: "4" },
  { label: "Good (6)", value: "6" },
  { label: "V. Good (8)", value: "8" },
  { label: "Excellent (10)", value: "10" },
];

export const WarningLetterOptions = [
  { label: "N/A", value: "N/A" },
  { label: "One (-10)", value: "-10" },
  { label: "Two (-20)", value: "-20" },
  { label: "Three (-30)", value: "-30" },
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
    disabled: true,
  },
  {
    name: "intelligence",
    label: "Intelligence",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions2 ? AppraisalMarkingOptions2 : [],
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
    comboboxOptions: AppraisalMarkingOptions2 ? AppraisalMarkingOptions2 : [],
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
    comboboxOptions: AppraisalMarkingOptions2 ? AppraisalMarkingOptions2 : [],
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
    comboboxOptions: AppraisalMarkingOptions2 ? AppraisalMarkingOptions2 : [],
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
    comboboxOptions: AppraisalMarkingOptions2 ? AppraisalMarkingOptions2 : [],
  },
  {
    name: "outputRelativeToGoalsQuality",
    label: "Output Relative to Goals (Quality)",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions2 ? AppraisalMarkingOptions2 : [],
  },
  {
    name: "analyticalAbility",
    label: "Analytical Ability",
    type: "select",
    comboboxOptions: AppraisalMarkingOptions ? AppraisalMarkingOptions : [],
  },
  {
    name: "numberOfWarningLettersInThisContract",
    label: "Number of Warning Letters (in this Contract)",
    type: "select",
    comboboxOptions: WarningLetterOptions ? WarningLetterOptions : [],
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
    name: "remarksByHR",
    label: "Remarks By (HR)",
    type: "textarea",
  },
  {
    name: "remarksByCEO",
    label: "Remarks By (CEO)",
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

export const addAppraisalFormFieldsApproved: AppraisalField[] = [
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
    type: "input",
    disabled: true,
  },
  {
    name: "intelligence",
    label: "Intelligence",
    type: "input",
    disabled: true,
  },
  {
    name: "relWithSupervisor",
    label: "Relationship with Supervisor",
    type: "input",
    disabled: true,
  },
  {
    name: "relWithColleagues",
    label: "Relationship with Colleagues",
    type: "input",
    disabled: true,
  },
  {
    name: "teamWork",
    label: "Team Work",
    type: "input",
    disabled: true,
  },
  {
    name: "abilityToCommunicateWrittenly",
    label: "Ability to Communicate Writtenly",
    type: "input",
    disabled: true,
  },
  {
    name: "abilityToCommunicateSpokenly",
    label: "Ability to Communicate Spokenly",
    type: "input",
    disabled: true,
  },
  {
    name: "integrityGeneral",
    label: "Integrity (General)",
    type: "input",
    disabled: true,
  },
  {
    name: "integrityIntellectual",
    label: "Integrity (Intellectual)",
    type: "input",
    disabled: true,
  },
  {
    name: "dedicationToWork",
    label: "Dedication to Work",
    type: "input",
    disabled: true,
  },
  {
    name: "reliability",
    label: "Reliability",
    type: "input",
    disabled: true,
  },
  {
    name: "responseUnderStressMentalPhysical",
    label: "Response Under Stress (Mental and Physical)",
    type: "input",
    disabled: true,
  },
  {
    name: "willingnessToAcceptAddedResponsibility",
    label: "Willingness to Accept Added Responsibility",
    type: "input",
    disabled: true,
  },
  {
    name: "initiative",
    label: "Initiative",
    type: "input",
    disabled: true,
  },
  {
    name: "financialAbility",
    label: "Financial Ability",
    type: "input",
    disabled: true,
  },
  {
    name: "professionalKnowledge",
    label: "Professional Knowledge",
    type: "input",
    disabled: true,
  },
  {
    name: "creativeness",
    label: "Creativeness",
    type: "input",
    disabled: true,
  },
  {
    name: "abilityToTakeDecisions",
    label: "Ability to Take Decisions",
    type: "input",
    disabled: true,
  },
  {
    name: "tendencyToLearn",
    label: "Tendency to Learn",
    type: "input",
    disabled: true,
  },
  {
    name: "abilityToPlanAndOrganizeWork",
    label: "Ability to Plan and Organize Work",
    type: "input",
    disabled: true,
  },
  {
    name: "optimalUseOfResources",
    label: "Optimal Use of Resources",
    type: "input",
    disabled: true,
  },
  {
    name: "outputRelativeToGoalsQuantity",
    label: "Output Relative to Goals (Quantity)",
    type: "input",
    disabled: true,
  },
  {
    name: "outputRelativeToGoalsQuality",
    label: "Output Relative to Goals (Quality)",
    type: "input",
    disabled: true,
  },
  {
    name: "analyticalAbility",
    label: "Analytical Ability",
    type: "input",
    disabled: true,
  },
  {
    name: "numberOfWarningLettersInThisContract",
    label: "Number of Warning Letters (in this Contract)",
    type: "input",
    disabled: true,
  },
  {
    name: "commentsOnJobDescription",
    label: "Comments On Job Description",
    type: "textarea",
    disabled: true,
  },
  {
    name: "commentsOnOverallPerformance",
    label: "Comments On Overall Performance",
    type: "textarea",
    disabled: true,
  },
  {
    name: "specificAdviceToTheEmployee",
    label: "Specific Advice to the Employee",
    type: "textarea",
    disabled: true,
  },
  {
    name: "remarksByHR",
    label: "Remarks By (HR)",
    type: "textarea",
    disabled: true,
  },
  {
    name: "remarksByCEO",
    label: "Remarks By (CEO)",
    type: "textarea",
    disabled: true,
  },
  {
    name: "appraisaledBy",
    label: "Appraised By (Your Name)",
    type: "input",
    disabled: true,
  },
  {
    name: "appraisaledByDesignation",
    label: "Appraised By Designation",
    type: "input",
    disabled: true,
  },
];
