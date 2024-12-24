"use client";
import ClientAvatar from "@/components/AvatarClient";
import DialogForm from "@/components/DialogForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InterviewRatingFormSchema, JobOfferSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Department,
  JobApplications,
  Role,
  Status,
  UserProfile,
} from "@prisma/client";
import axios from "axios";
import { Country } from "country-state-city";
import { Check, Crown, Flag, Loader2, Mail, User } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ScoreGauge } from "./ScoreGauge";

interface UserAboutSectionProps {
  user: (UserProfile & { role: Role | null }) | null;
  applicant:
    | (UserProfile & { role: Role | null } & { status: Status | null })
    | null;
  userJobApplications:
    | (UserProfile & { jobApplications: JobApplications[] })
    | null;
  department: Department[] | null;
  role: Role[] | null;
}

const UserAboutSection = ({
  user,
  applicant,
  userJobApplications,
  department,
  role,
}: UserAboutSectionProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSecondDialogOpen, setSecondDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);
  const [currentJobApplication, setCurrentJobApplication] =
    useState<JobApplications | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (applicant?.isHired) {
      router.push("/admin/interviewees");
    }
  }, [applicant, router]);

  useEffect(() => {
    if (applicant?.currentJobApplicationId && userJobApplications) {
      const currentApp = userJobApplications.jobApplications.find(
        (app) => app.id === applicant.currentJobApplicationId
      );
      setCurrentJobApplication(currentApp || null);
    }
  }, [applicant, userJobApplications]);

  const isOffered =
    currentJobApplication?.applicationStatusId === "cm523xdas0000z01cnum31vj7"; // Offered
  const isHired = applicant?.isHired || false;

  const countryName = applicant?.country
    ? Country.getCountryByCode(applicant.country)?.name || applicant.country
    : "Not Specified";

  const form = useForm<z.infer<typeof InterviewRatingFormSchema>>({
    resolver: zodResolver(InterviewRatingFormSchema),
    defaultValues: {
      candidateName: applicant?.fullName,
      personality: "0",
      appearance: "0",
      communication: "0",
      reasoning: "0",
      education: "0",
      jobKnowledge: "0",
      workExperience: "0",
      generalKnowledge: "0",
      iq: "0",
      pose: "0",
      salaryExpectations: "",
      strengths: "",
      weaknesses: "",
      remarks: "",
      interviewDate: new Date(),
      positionApplied: currentJobApplication?.department || "IT Department",
      interviewerName: user?.fullName || "",
      interviewerDesignation: user?.role?.name || "",
    },
  });

  const jobOfferForm = useForm<z.infer<typeof JobOfferSchema>>({
    resolver: zodResolver(JobOfferSchema),
    defaultValues: {
      designation: "",
      department: currentJobApplication?.department || "IT Department",
      role: "Employee",
      salary: "",
    },
  });

  const calculateScore = () => {
    if (!currentJobApplication) return 0;

    const obtainedPoints =
      parseInt(currentJobApplication.appearance || "0") +
      parseInt(currentJobApplication.communication || "0") +
      parseInt(currentJobApplication.reasoning || "0") +
      parseInt(currentJobApplication.education || "0") +
      parseInt(currentJobApplication.jobKnowledge || "0") +
      parseInt(currentJobApplication.workExperience || "0") +
      parseInt(currentJobApplication.generalKnowledge || "0") +
      parseInt(currentJobApplication.iq || "0") +
      parseInt(currentJobApplication.pose || "0") +
      parseInt(currentJobApplication.personality || "0");

    return obtainedPoints;
  };

  const totalPoints = 40;
  const score = calculateScore();

  const onJobOfferSubmit = async (data: z.infer<typeof JobOfferSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/jobOffer`, {
        id: applicant?.userId,
        ...data,
      });
      toast.success(`An offer has been sent to ${applicant?.fullName}.`);
      setSecondDialogOpen(false);
      setIsLoading(false);
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setSecondDialogOpen(false);
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof InterviewRatingFormSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/scheduleAnInterview`, {
        id: applicant?.userId,
        ...data,
      });
      console.log(data);
      toast.success(
        `Interview updated successfully for ${applicant?.fullName}.`
      );
      setDialogOpen(false);
      setIsLoading(false);
      router.refresh();
      redirect("/admin/interviewees");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setDialogOpen(false);
      setIsLoading(false);
    }
  };

  const onReject = async () => {
    try {
      setIsRejection(true);
      await axios.post(`/api/user/${user?.userId}/rejectJobApplication`, {
        applicantId: applicant?.userId,
        notifcationTitle: "Application Rejected",
        notificationMessage:
          "Your Application has been rejected. Please try again later.",
      });
      toast.success(`Applicant ${applicant?.fullName} rejected successfully.`);
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsRejection(false);
    }
  };

  const avatarFallback =
    applicant?.fullName?.substring(0, 2).toUpperCase() || "U";
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <div className='w-full flex flex-col gap-5 items-center justify-center'>
            <div className='relative lg:w-32 lg:h-32 md:w-24 md:h-24 sm:w-40 sm:h-40 w-32 h-32'>
              {applicant?.userImage ? (
                <Avatar className='w-full h-full'>
                  <AvatarImage src={applicant.userImage} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <ClientAvatar avatarFallback={avatarFallback} />
              )}
              {isOffered && (
                <div className='absolute -top-2 -left-5 -rotate-12 uppercase font-bold bg-yellow-500 text-yellow-800 px-3 py-1 rounded-full'>
                  Offered
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2 items-center'>
              <h2 className='text-lg'>{applicant?.fullName}</h2>
              <h3 className='text-muted-foreground text-base bg-gray-800 py-1 px-3 rounded-sm'>
                {applicant?.role?.name}
              </h3>
            </div>
          </div>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Details
          </h3>
          <Separator />
          <div className='flex gap-2'>
            <User className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Full Name: ${applicant?.fullName}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Mail className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Email: ${applicant?.email}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Check className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Status: ${
              applicant?.status?.name || "Not Appointed Yet"
            }`}</h3>
          </div>
          <div className='flex gap-2'>
            <Crown className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Role: ${applicant?.role?.name}`}</h3>
          </div>
          <div className='flex gap-2'>
            <Flag className='w-5 h-5 text-muted-foreground' />
            <h3 className='text-muted-foreground text-base -mt-0.5'>{`Country: ${countryName}`}</h3>
          </div>
        </div>
        <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
          Reference
        </h3>
        <Separator className='-mt-5' />
        {userJobApplications?.jobApplications.map((application, index) => (
          <div key={index} className='flex flex-col gap-1 -mt-6'>
            {application.reference ? (
              <h3 className='text-muted-foreground text-base'>
                {application.reference}
              </h3>
            ) : (
              <h3 className='text-muted-foreground text-base'>
                No reference provided.
              </h3>
            )}
            {application.referenceContact ? (
              <h3 className='text-muted-foreground text-base'>
                {application.referenceContact}
              </h3>
            ) : (
              <h3 className='text-muted-foreground text-base'>
                No reference contact provided.
              </h3>
            )}
          </div>
        ))}
        {currentJobApplication?.isInterviewed && (
          <div className='mt-4'>
            <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider mb-4'>
              Interview Score
            </h3>
            <ScoreGauge score={score} maxScore={totalPoints} />
          </div>
        )}
        <div className='flex sm:flex-row flex-col flex-wrap md:justify-end justify-center gap-4'>
          <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
            {currentJobApplication?.isInterviewed
              ? "Update Interview"
              : "Interview"}
          </Button>
          <Button variant={"destructive"} onClick={onReject}>
            {isRejection ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <span>Reject</span>
            )}
          </Button>
        </div>
        <Button
          variant={"success"}
          onClick={() => setSecondDialogOpen(true)}
          disabled={isOffered || isHired}
        >
          Hire Applicant
        </Button>
      </div>

      <DialogForm
        isOpen={isSecondDialogOpen}
        onOpenChange={setSecondDialogOpen}
        title='Job Offer Form'
        description='Fill out the job offer form for the applicant.'
        fields={[
          {
            name: "designation",
            label: "Designation",
            type: "input",
            placeholder: "e.g 'Software Engineer'",
          },
          {
            name: "department",
            label: "Department",
            type: "select",
            comboboxOptions: department
              ? department.map((d) => ({ label: d.name, value: d.name }))
              : [],
          },
          {
            name: "role",
            label: "Role",
            type: "select",
            comboboxOptions: role
              ? role.map((r) => ({ label: r.name, value: r.name }))
              : [],
          },
          {
            name: "salary",
            label: "Salary",
            type: "input",
            placeholder: "e.g '100000'",
          },
        ]}
        buttons={[
          {
            label: "Submit",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setSecondDialogOpen(false),
          },
        ]}
        onSubmit={onJobOfferSubmit}
        form={jobOfferForm}
      />

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Interview Rating Form'
        description='Fill out the interview rating form for the applicant.'
        fields={[
          {
            name: "candidateName",
            label: "Candidate Name",
            placeholder: "Enter candidate name",
            type: "input",
            disabled: true,
          },
          {
            name: "interviewDate",
            label: "Interview Date",
            type: "date",
          },
          {
            name: "positionApplied",
            label: "Position Applied For",
            type: "input",
            disabled: true,
          },
          {
            name: "appearance",
            label: "Appearance/Mannerism",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "communication",
            label: "Communication/Presentation skills",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "reasoning",
            label: "Reasoning and Judgment",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "education",
            label: "Education",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "jobKnowledge",
            label: "Job/Subject Knowledge",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "workExperience",
            label: "Work Experience",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "generalKnowledge",
            label: "General Knowledge",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "iq",
            label: "I.Q.",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "pose",
            label: "Pose & Maturity",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "personality",
            label: "Personality, Attitudes and Social adjustment",
            type: "select",
            comboboxOptions: [
              { label: "Poor (0)", value: "0" },
              { label: "Average (1)", value: "1" },
              { label: "Good (2)", value: "2" },
              { label: "V. Good (3)", value: "3" },
              { label: "Excellent (4)", value: "4" },
            ],
          },
          {
            name: "salaryExpectations",
            label: "Salary Expectations",
            type: "input",
          },
          {
            name: "strengths",
            label: "Strengths for this job",
            type: "textarea",
          },
          {
            name: "weaknesses",
            label: "Weakness for this job",
            type: "textarea",
          },
          { name: "remarks", label: "Remarks", type: "textarea" },
          { name: "interviewerName", label: "Interviewer Name", type: "input" },
          {
            name: "interviewerDesignation",
            label: "Interviewer Designation",
            type: "input",
          },
        ]}
        buttons={[
          {
            label: "Submit and Generate PDF",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
            // onClick: () => {
            //   onSubmit(form.getValues());
            // },
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setDialogOpen(false),
          },
        ]}
        onSubmit={onSubmit}
        form={form}
      />
    </main>
  );
};

export default UserAboutSection;
