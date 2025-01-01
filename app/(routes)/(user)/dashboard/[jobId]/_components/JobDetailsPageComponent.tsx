"use client";

import Banner from "@/components/Banner";
import Box from "@/components/Box";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import DialogForm from "@/components/DialogForm";
import Preview from "@/components/PreviewEditorText";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { JobApplicationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, UserProfile, JobApplications, Attachments } from "@prisma/client";
import axios from "axios";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface JobDetailsPageComponentProps {
  job: Job & { attachments: Attachments[] };
  jobId: string;
  userProfile: (UserProfile & { JobApplications: JobApplications[] }) | null;
}

const experienceData = [
  { value: "0", label: "Fresher" },
  { value: "1", label: "0-2 years" },
  { value: "2", label: "2-5 years" },
  { value: "3", label: "5-10 years" },
  { value: "4", label: "10+ years" },
];

const JobDetailsPageComponent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsPageComponentProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const getExperienceLabel = (years: string | null) => {
    const experience = experienceData.find((exp) => exp.value === years);
    return experience ? experience.label : "NA";
  };

  const form = useForm<z.infer<typeof JobApplicationSchema>>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: {
      department: job.department || "",
      coverLetter: "",
      reference: "",
      referenceContact: "",
    },
  });

  const onApplied = async (values: z.infer<typeof JobApplicationSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(
        `/api/user/${userProfile?.userId}/submitJobApplication`,
        { jobId, ...values }
      );
      toast.success(
        `${userProfile?.fullName} Your application has been submitted successfully.`
      );
      setOpen(false);
      router.refresh();
      setIsLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  const hasApplied = userProfile?.JobApplications.some(
    (application) => application.jobId === jobId
  );

  return (
    <>
      {hasApplied && (
        <Banner
          variant='success'
          label="Thank you for applying! We're reviewing it carefully. We'll be in touch soon if your application matches our needs."
        />
      )}

      <Box className='mt-4'>
        <CustomBreadCrumb
          breadCrumbPage={job?.title || ""}
        />
      </Box>

      {/* Job Cover Image */}
      <Box className='mt-4 relative'>
        <div className='w-full flex items-center md:h-72 h-40 relative rounded-lg'>
          {job?.imageUrl ? (
            <Image
              alt={job.title}
              src={job.imageUrl}
              fill
              className='object-cover w-full h-full rounded-lg'
            />
          ) : (
            <div className='w-full h-full relative bg-emerald-100 flex items-center justify-center'>
              <h2 className='text-3xl font-semibold tracking-wider text-emerald-500'>
                {job.title}
              </h2>
            </div>
          )}
        </div>
      </Box>

      {/* Title and Action Buttons */}
      <div className='md:w-[78vw] w-[85vw] mt-14'>
        <div className='w-full flex md:flex-row flex-col md:justify-between justify-start md:items-center items-start gap-5'>
          <div className='flex flex-col md:ml-10 ml-6'>
            <div className='flex items-center'>
              <h1 className='md:text-2xl text-md font-semibold'>{job.title}</h1>
            </div>
            <div className='text-sm font-medium text-neutral-500 flex flex-wrap truncate'>
              <h2 className='truncate text-foreground'>{job.department}</h2>
              <Dot className='md:text-sm text-xs -mt-0.5' />
              <h2 className='truncate'>
                {new Date(job.createdAt).toLocaleDateString()} (
                {Math.floor(
                  (new Date().getTime() - new Date(job.createdAt).getTime()) /
                    (1000 * 3600 * 24)
                )}{" "}
                days ago)
              </h2>
            </div>
          </div>

          <div className='flex md:ml-10 ml-6'>
            {userProfile ? (
              <>
                {!hasApplied ? (
                  <Button
                    variant='primary'
                    type='submit'
                    onClick={() => setOpen(true)}
                  >
                    Apply Now
                  </Button>
                ) : (
                  <Button
                    variant='outline'
                    className='hover:text-white hover:shadow-sm hover:bg-[#0AAB7C]/80 text-[#0AAB7C] border-[#0AAB7C]'
                    type='button'
                    disabled
                  >
                    Already Applied
                  </Button>
                )}
              </>
            ) : (
              <Link href='/user'>
                <Button variant='primary' type='submit'>
                  Update Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Experience, Work Mode, Employee Type, Offer Salary */}
      <div className='md:w-[78vw] w-[85vw] mt-10 md:ml-10'>
        <div className='md:ml-10 ml-6 flex flex-col md:flex-row md:justify-between items-start md:gap-10 gap-5'>
          <div className='flex md:flex-col w-full md:justify-start justify-between flex-row items-center md:items-start gap-3'>
            <h2 className='text-md font-medium text-neutral-400'>Experience</h2>
            <h3 className='text-sm font-medium'>
              {getExperienceLabel(job.yearsOfExperience)}
            </h3>
          </div>
          <div className='flex md:flex-col w-full md:justify-start justify-between flex-row items-center md:items-start gap-3'>
            <h2 className='text-md font-medium text-neutral-400'>Work Mode</h2>
            <h3 className='text-sm font-medium'>{job.workMode}</h3>
          </div>
          <div className='flex md:flex-col w-full md:justify-start justify-between flex-row items-center md:items-start gap-3'>
            <h2 className='text-md font-medium text-neutral-400'>
              Employee Type
            </h2>
            <h3 className='text-sm font-medium'>{job.shiftTiming}</h3>
          </div>
          <div className='flex md:flex-col w-full md:justify-start justify-between flex-row items-center md:items-start gap-3'>
            <h2 className='text-md font-medium text-neutral-400'>
              Offer Salary
            </h2>
            <h3 className='text-sm font-medium'>{job.salary}</h3>
          </div>
        </div>
        <Separator className='mt-10 mb-10 md:ml-0 ml-3' />
      </div>

      {/* Job Short Description */}
      <div className='md:w-[76vw] w-[80vw] mt-10 md:ml-10 ml-6'>
        <h2 className='text-md font-semibold'>About the Job</h2>
        <p className='text-sm mt-2 text-justify'>{job.shortDescription}</p>
      </div>

      {/* Job Description */}
      {job?.description && (
        <div className='md:w-[76vw] w-[80vw] mt-10 md:ml-6 ml-3'>
          <Preview value={job?.description} />
          <Separator className='mt-10 mb-10 md:ml-0 ml-3' />
        </div>
      )}

      {/* Attachments */}
      <div className='md:w-[76vw] w-[80vw] mt-10 md:ml-10 ml-6'>
        <h2 className='text-md font-semibold'>Attachments</h2>
        <p className='text-neutral-300 font-medium text-sm'>
          Download the attachment(s) to get more information about the job
        </p>
        {job?.attachments &&
          job?.attachments.length > 0 &&
          job.attachments.map((attachment) => (
            <div className='mt-2' key={attachment.id}>
              <Link
                href={attachment.url}
                target='_blank'
                download
                className='text-[#0AAB7C] hover:underline'
              >
                {attachment.name}
              </Link>
            </div>
          ))}
        <Separator className='mt-10 mb-10 md:-ml-3' />
      </div>

      <DialogForm
        isOpen={open}
        onOpenChange={setOpen}
        title={`Application Form for ${job.title}`}
        description='Please fill out the following fields to submit your application.'
        fields={[
          {
            name: "department",
            label: "Department",
            type: "input",
            disabled: true,
          },
          {
            name: "coverLetter",
            label: "Cover Letter",
            type: "textarea",
            placeholder:
              "e.g 'I'm a software engineer with 5 years of experience...'",
          },
          {
            name: "reference",
            label: "Reference",
            type: "input",
            placeholder: "e.g 'John Doe'",
          },
          {
            name: "referenceContact",
            label: "Reference Contact",
            type: "input",
            placeholder: "e.g '1234567890 / email@gmail.com'",
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
            onClick: () => setOpen(false),
          },
        ]}
        onSubmit={onApplied}
        form={form}
      />
    </>
  );
};

export default JobDetailsPageComponent;
