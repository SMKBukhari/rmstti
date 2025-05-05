"use client";
import ClientAvatar from "@/components/AvatarClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InterviewRatingFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobApplications, Role, Status, UserProfile } from "@prisma/client";
import axios from "axios";
import { Country } from "country-state-city";
import { Check, Crown, Flag, Loader2, Mail, User } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ScoreGauge } from "./ScoreGauge";
import DialogForm from "@/components/DialogForm";

interface UserAboutSectionProps {
  user: (UserProfile & { role: Role | null }) | null;
  applicant:
    | (UserProfile & { role: Role | null } & { status: Status | null })
    | null;
  userJobApplications:
    | (UserProfile & { jobApplications: JobApplications[] })
    | null;
  isRejectedApplicant: boolean;
}

const UserAboutSection = ({
  user,
  applicant,
  userJobApplications,
  isRejectedApplicant,
}: UserAboutSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentJobApplication, setCurrentJobApplication] =
    useState<JobApplications | null>(null);
  const router = useRouter();
  const countryName = applicant?.country
    ? Country.getCountryByCode(applicant.country)?.name || applicant.country
    : "Not Specified";

  useEffect(() => {
    if (applicant?.currentJobApplicationId && userJobApplications) {
      const currentApp = userJobApplications.jobApplications.find(
        (app) => app.id === applicant.currentJobApplicationId
      );
      setCurrentJobApplication(currentApp || null);
    }
  }, [applicant, userJobApplications]);

  const form = useForm<z.infer<typeof InterviewRatingFormSchema>>({
    resolver: zodResolver(InterviewRatingFormSchema),
    defaultValues: {
      candidateName: applicant?.fullName ?? "",
      experience: currentJobApplication?.experience ?? "N/A",
      skills: currentJobApplication?.skills ?? "N/A",
      education: currentJobApplication?.education ?? "N/A",
      jobKnowledge: currentJobApplication?.jobKnowledge ?? "N/A",
      generalKnowledge: currentJobApplication?.generalKnowledge ?? "N/A",
      culturalFit: currentJobApplication?.culturalFit ?? "N/A",
      adaptability: currentJobApplication?.adaptability ?? "N/A",
      motivation: currentJobApplication?.motivation ?? "N/A",
      problemSolving: currentJobApplication?.problemSolving ?? "N/A",
      communication: currentJobApplication?.communication ?? "N/A",
      teamWork: currentJobApplication?.teamWork ?? "N/A",
      leaderShipPotential: currentJobApplication?.leaderShipPotential ?? "N/A",
      professionalism: currentJobApplication?.professionalism ?? "N/A",
      criticalThinking: currentJobApplication?.criticalThinking ?? "N/A",
      appearance: currentJobApplication?.appearance ?? "N/A",
      maturity: currentJobApplication?.maturity ?? "N/A",
      salaryExpectations: currentJobApplication?.salaryExpectation ?? "",
      strengths: currentJobApplication?.strengths ?? "",
      weaknesses: currentJobApplication?.weaknesses ?? "",
      remarks: currentJobApplication?.remarks ?? "",
      interviewDate: currentJobApplication?.interviewDate ?? new Date(),
      positionApplied: currentJobApplication?.department ?? "IT Department",
      interviewerName: user?.fullName ?? "",
      interviewerDesignation: user?.role?.name ?? "",
    },
  });

  useEffect(() => {
    if (currentJobApplication) {
      form.reset({
        candidateName: applicant?.fullName ?? "",
        experience: currentJobApplication.experience ?? "N/A",
        skills: currentJobApplication.skills ?? "N/A",
        education: currentJobApplication.education ?? "N/A",
        jobKnowledge: currentJobApplication.jobKnowledge ?? "N/A",
        generalKnowledge: currentJobApplication.generalKnowledge ?? "N/A",
        culturalFit: currentJobApplication.culturalFit ?? "N/A",
        adaptability: currentJobApplication.adaptability ?? "N/A",
        motivation: currentJobApplication.motivation ?? "N/A",
        problemSolving: currentJobApplication.problemSolving ?? "N/A",
        communication: currentJobApplication.communication ?? "N/A",
        teamWork: currentJobApplication.teamWork ?? "N/A",
        leaderShipPotential: currentJobApplication.leaderShipPotential ?? "N/A",
        professionalism: currentJobApplication.professionalism ?? "N/A",
        criticalThinking: currentJobApplication.criticalThinking ?? "N/A",
        appearance: currentJobApplication.appearance ?? "N/A",
        maturity: currentJobApplication.maturity ?? "N/A",
        salaryExpectations: currentJobApplication.salaryExpectation ?? "",
        strengths: currentJobApplication.strengths ?? "",
        weaknesses: currentJobApplication.weaknesses ?? "",
        remarks: currentJobApplication.remarks ?? "",
        interviewDate: currentJobApplication.interviewDate ?? new Date(),
        positionApplied: currentJobApplication.department ?? "IT Department",
        interviewerName: user?.fullName ?? "",
        interviewerDesignation: user?.role?.name ?? "",
      });
    }
  }, [currentJobApplication, applicant, user, form]);

  const criteria = {
    experience: currentJobApplication?.experience,
    skills: currentJobApplication?.skills,
    education: currentJobApplication?.education,
    jobKnowledge: currentJobApplication?.jobKnowledge,
    generalKnowledge: currentJobApplication?.generalKnowledge,
    culturalFit: currentJobApplication?.culturalFit,
    adaptability: currentJobApplication?.adaptability,
    motivation: currentJobApplication?.motivation,
    problemSolving: currentJobApplication?.problemSolving,
    communication: currentJobApplication?.communication,
    teamWork: currentJobApplication?.teamWork,
    leaderShipPotential: currentJobApplication?.leaderShipPotential,
    professionalism: currentJobApplication?.professionalism,
    criticalThinking: currentJobApplication?.criticalThinking,
    appearance: currentJobApplication?.appearance,
    maturity: currentJobApplication?.maturity,
  };

  const calculateScore = () => {
    if (!currentJobApplication) return 0;

    const validCriteria = Object.values(criteria).filter(
      (value) => value !== "N/A"
    );

    return validCriteria.reduce(
      (total, value) => total + Number.parseInt(value || "0"),
      0
    );
  };

  const score = calculateScore();
  const totalPoints =
    Object.values(criteria).filter((value) => value !== "N/A").length * 5;

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `/api/user/${user?.userId}/shortlistRejectedApplication`,
        {
          applicantId: applicant?.userId,
        }
      );
      toast.success(
        `Applicant ${applicant?.fullName} has been shortlisted successfully.`
      );
      setIsLoading(false);
      router.refresh();
      redirect("/admin/rejected");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const avatarFallback =
    applicant?.fullName?.substring(0, 2).toUpperCase() || "U";
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <div className='w-full flex flex-col gap-5 items-center justify-center'>
            <div className='lg:w-32 lg:h-32 md:w-24 md:h-24 sm:w-40 sm:h-40 w-32 h-32'>
              {applicant?.userImage ? (
                <Avatar className='w-full h-full'>
                  <AvatarImage src={applicant.userImage} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <ClientAvatar avatarFallback={avatarFallback} />
              )}
            </div>
            <div className='flex flex-col gap-2 items-center'>
              <h2 className='text-lg'>{applicant?.fullName}</h2>
              <h3 className=' text-base bg-destructive text-destructive-foreground py-1 px-3 rounded-sm'>
                {isRejectedApplicant ? "Rejected" : `${applicant?.role?.name}`}
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
        <div className='flex sm:flex-row flex-col flex-wrap gap-4'>
          <Button
            variant={"outline"}
            className='w-full'
            onClick={() => setDialogOpen(!isDialogOpen)}
          >
            <h3>Interview Rating Form</h3>
          </Button>
        </div>
        <div className='flex sm:flex-row flex-col flex-wrap gap-4'>
          <Button variant={"primary"} className='w-full' onClick={onSubmit}>
            {isLoading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              "Shortlist"
            )}
          </Button>
        </div>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Interview Rating Form'
        description="Check the candidate's interview rating."
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
            disabled: true,
          },
          {
            name: "positionApplied",
            label: "Position Applied For",
            type: "input",
            disabled: true,
          },
          {
            name: "experience",
            label: "Experience",
            type: "input",
            disabled: true,
          },
          {
            name: "skills",
            label: "Skills",
            type: "input",
            disabled: true,
          },
          {
            name: "education",
            label: "Education",
            type: "input",
            disabled: true,
          },
          {
            name: "jobKnowledge",
            label: "Job Knowledge",
            type: "input",
            disabled: true,
          },
          {
            name: "generalKnowledge",
            label: "General Knowledge/IQ",
            type: "input",
            disabled: true,
          },
          {
            name: "culturalFit",
            label: "Cultural Fit",
            type: "input",
            disabled: true,
          },
          {
            name: "adaptability",
            label: "Adaptability",
            type: "input",
            disabled: true,
          },
          {
            name: "motivation",
            label: "Motivation",
            type: "input",
            disabled: true,
          },
          {
            name: "problemSolving",
            label: "Problem Solving",
            type: "input",
            disabled: true,
          },
          {
            name: "communication",
            label: "Communication",
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
            name: "leaderShipPotential",
            label: "Leadership Potential",
            type: "input",
            disabled: true,
          },
          {
            name: "professionalism",
            label: "Professionalism",
            type: "input",
            disabled: true,
          },
          {
            name: "criticalThinking",
            label: "Critical Thinking",
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
            name: "maturity",
            label: "Maturity",
            type: "input",
            disabled: true,
          },
          {
            name: "salaryExpectations",
            label: "Salary Expectations",
            type: "input",
            disabled: true,
          },
          {
            name: "strengths",
            label: "Strengths for this job",
            type: "textarea",
            disabled: true,
          },
          {
            name: "weaknesses",
            label: "Weakness for this job",
            type: "textarea",
            disabled: true,
          },
          {
            name: "remarks",
            label: "Remarks",
            type: "textarea",
            disabled: true,
          },
          {
            name: "interviewerName",
            label: "Interviewer Name",
            type: "input",
            disabled: true,
          },
          {
            name: "interviewerDesignation",
            label: "Interviewer Designation",
            type: "input",
            disabled: true,
          },
        ]}
        buttons={[
          {
            label: "Cancel",
            type: "button",
            onClick: () => setDialogOpen(false),
          },
        ]}
        onSubmit={() => {
          console.log("Form submitted");
        }}
        form={form}
      />
    </main>
  );
};

export default UserAboutSection;
