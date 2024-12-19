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
