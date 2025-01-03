import * as z from "zod";

export const UserBasicInfor = z.object({
  fullName: z.string(),
  gender: z.enum(["Male", "Female", "Other", "Select"]),
  contactNumber: z.string().length(11),
  DOB: z.date(),
  city: z.string(),
  country: z.string(),
});

export const UserSocialLinks = z.object({
  skype: z.string().optional(),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  behance: z.string().optional(),
});

export const UserExperience = z.object({
  jobTitle: z.string(),
  employmentType: z.string(),
  companyName: z.string(),
  location: z.string(),
  startDate: z.date().optional(),
  currentlyWorking: z.boolean().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
});

export const UserEducations = z.object({
  university: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  grade: z.string().optional(),
  startDate: z.date().optional(),
  currentlyStudying: z.boolean().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
});

export const UserSkills = z.object({
  name: z.string(),
  experienceLevel: z.string(),
});

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const SingUpSchema = z
  .object({
    fullName: z.string().min(1, { message: "Please enter your Name" }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters",
      })
      .max(12, {
        message: "Password must be less than 12 characters",
      }),
    ConfirmPassword: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters",
      })
      .max(12, {
        message: "Password must be less than 12 characters",
      }),
    gender: z.enum(["Male", "Female", "Other"], {
      message: "Please Select Gender",
    }),
    contactNumber: z
      .string()
      .length(11, {
        message: "Please enter a valid contact number",
      })
      .regex(/^\d+$/, {
        message: "Please enter a valid contact number",
      }),
    DOB: z.date().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  })
  .refine((data) => data.password === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["ConfirmPassword"],
  });

export const OTPSchema = z.object({
  otpCode: z.string().length(6, {
    message: "Please enter a valid OTP code",
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    ConfirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["ConfirmPassword"],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    newPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    ConfirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .refine((data) => data.newPassword === data.ConfirmPassword, {
    message: "Passwords do not match",
  });

export const ChangeEmailSchema = z.object({
  currentEmail: z.string().email({
    message: "Please enter a valid email address",
  }),
  newEmail: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const JobApplicationSchema = z.object({
  department: z.string().optional(),
  coverLetter: z.string().optional(),
  reference: z.string().optional(),
  referenceContact: z.string().optional(),
});

export const ScheduleInterviewSchema = z.object({
  interviewDateTime: z.date(),
});

export const InterviewRatingFormSchema = z.object({
  candidateName: z.string().min(1, "Candidate name is required"),
  interviewDate: z.date(),
  positionApplied: z.string().min(1, "Position applied is required"),
  appearance: z.string().min(1, "Appearance/Mannerism rating is required."),
  communication: z
    .string()
    .min(1, "Communication/Presentation skills rating is required."),
  reasoning: z.string().min(1, "Reasoning and Judgment rating is required."),
  education: z.string().min(1, "Education rating is required."),
  jobKnowledge: z.string().min(1, "Job/Subject Knowledge rating is required."),
  workExperience: z.string().min(1, "Work Experience rating is required."),
  generalKnowledge: z.string().min(1, "General Knowledge rating is required."),
  iq: z.string().min(1, "I.Q. rating is required."),
  pose: z.string().min(1, "Pose & Maturity rating is required."),
  personality: z
    .string()
    .min(
      1,
      "Personality, Attitudes, and Social adjustment rating is required."
    ),
  salaryExpectations: z.string(),
  strengths: z.string(),
  weaknesses: z.string(),
  remarks: z.string(),
  interviewerName: z.string().min(1, "Interviewer name is required"),
  interviewerDesignation: z
    .string()
    .min(1, "Interviewer designation is required"),
});

export const JobOfferSchema = z.object({
  designation: z.string(),
  department: z.string(),
  salary: z.string(),
  role: z.string(),
});

export const JobOfferAcceptanceSchema = z.object({
  joiningDate: z.date(),
  salary: z.string(),
  designation: z.string(),
  department: z.string(),
  role: z.string(),
});

export const LeaveRequestSchema = z.object({
  leaveType: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string(),
});

export const LeaveDeleteSchema = z.object({
  agree: z.string(),
});

export const DepartmentsSchema = z.object({
  name: z.string(),
});

export const AddNewEmployeeSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.enum(["Male","Female","Other"]).optional(),
  contactNumber: z.string().length(11).optional(),
  DOB: z.date().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  role: z.string().optional(),
  salary: z.string().optional(),
  DOJ: z.date().optional(),
});