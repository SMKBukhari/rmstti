import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { toast } from "sonner";
import { OTPMail } from "./designs/otpMail";
import { ForgotPasswordMail } from "@/lib/emails/designs/forgotPasswordLinkMail";
import { ApplicationReceivedMail } from "./designs/applicationReceivedMail";
import { InterviewScheduledMail } from "./designs/interviewScheduleMail";
import { ApplicationRejectedMail } from "./designs/rejectJobApplicationMail ";
import { JobOfferMail } from "./designs/jobOfferMail";

const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;
export const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.verify();
  } catch (error) {
    console.error(error);
    toast.error("Failed to send email");
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult;
  } catch (error) {
    console.error(error);
    toast.error("Failed to send email");
    return;
  }
};

// const { SMTP_PASSWORD, SMTP_EMAIL, SMTP_HOST, SMTP_PORT } = process.env;

// export const sendMail = async ({
//   to,
//   subject,
//   body,
// }: {
//   to: string;
//   subject: string;
//   body: string;
// }) => {
//   const transport = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: Number(SMTP_PORT),
//     secure: true, // Use SSL
//     auth: {
//       user: SMTP_EMAIL,
//       pass: SMTP_PASSWORD,
//     },
//   });

//   try {
//     await transport.verify();
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to verify email configuration");
//     return;
//   }

//   try {
//     const sendResult = await transport.sendMail({
//       from: SMTP_EMAIL,
//       to,
//       subject,
//       html: body,
//     });
//     return sendResult;
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to send email");
//     return;
//   }
// };


export const compileOTPMail = async (fullName: string, otp: string) => {
  const template = handlebars.compile(OTPMail);

  const htmlBody = template({
    userName: fullName,
    otp: otp,
  });

  return htmlBody;
};

export const compileResetLinkMail = async (
  fulllName: string,
  resetLink: string
) => {
  const template = handlebars.compile(ForgotPasswordMail);

  const htmlBody = template({
    userName: fulllName,
    resetLink: resetLink,
  });

  return htmlBody;
};

export const compileApplicationReceivedMail = async (fullName: string) => {
  const template = handlebars.compile(ApplicationReceivedMail);

  const htmlBody = template({
    userName: fullName,
  });

  return htmlBody;
};

export const compileInterviewScheduledMail = async (
  fullName: string,
  interviewDate: string,
  interviewTime: string
) => {
  const template = handlebars.compile(InterviewScheduledMail);

  const htmlBody = template({
    fullName: fullName,
    interviewDate: interviewDate,
    interviewTime: interviewTime,
  });

  return htmlBody;
};

export const compileRejectedApplicationMail = async (fullName: string) => {
  const template = handlebars.compile(ApplicationRejectedMail);

  const htmlBody = template({
    fullName: fullName,
  });

  return htmlBody;
};

export const compileJobOfferMail = async (
  fullName: string,
  designation: string,
  department: string,
  salary: string
) => {
  const template = handlebars.compile(JobOfferMail);

  const htmlBody = template({
    fullName: fullName,
    designation: designation,
    department: department,
    salary: salary,
  });

  return htmlBody;
};

export const compileHiredMail = async (
  fullName: string,
  designation: string,
  department: string,
  salary: string,
  joiningDate: string
) => {
  const template = handlebars.compile(JobOfferMail);

  const htmlBody = template({
    fullName: fullName,
    designation: designation,
    department: department,
    salary: salary,
    joiningDate: joiningDate,
  });

  return htmlBody;
};

export const compileNewEmployeeInfoMail = async (
  fullName: string,
  email: string,
  password: string,
  designation: string,
  department: string,
  salary: string
) => {
  const template = handlebars.compile(JobOfferMail);

  const htmlBody = template({
    fullName: fullName,
    email: email,
    password: password,
    designation: designation,
    department: department,
    salary: salary,
  });

  return htmlBody;
};

// export const sendTestEmail = async () => {
//   const testEmail = "unveiltech.mk@gmail.com"; // Change this to a valid email address
//   const subject = "Test Email - OTP";
//   const fullName = "John Doe"; // Test user name
//   const otp = "123456"; // Test OTP

//   const body = await compileOTPMail(fullName, otp);

//   const result = await sendMail({
//     to: testEmail,
//     subject: subject,
//     body: body,
//   });

//   if (result) {
//     console.log("Test email sent successfully:", result);
//   } else {
//     console.error("Failed to send test email");
//   }
// };
