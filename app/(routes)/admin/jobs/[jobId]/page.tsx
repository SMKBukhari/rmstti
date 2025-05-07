import { db } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import JobPublishActions from "./_components/JobPublish-Actions";
import Banner from "@/components/Banner";
import TitleForm from "./_components/TitleForm";
import ImageForm from "./_components/ImageForm";
import ShortDescription from "./_components/ShortDescription";
import ShiftTimingMode from "./_components/ShiftTiming-Mode";
import JobMode from "./_components/JobMode";
import WorkExperienceForm from "./_components/WorkExperience-Form";
import JobDescription from "./_components/JobDescription";
import AttachmentsForm from "./_components/AttachmentsForm";
import { cookies } from "next/headers";
import JobSalaryForm from "./_components/JobSalary";
import SectionWrapper from "@/components/SectionWrapper";
import JobDepartment from "./_components/JobDepartment";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  const departments = await db.department.findMany();

  const requiredFields = [job?.title, job?.description, job?.imageUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className='mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen'>
      <Link
        href='/ceo/jobs'
        className='inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors mb-8'
      >
        <ArrowLeft className='w-4 h-4 mr-2' />
        Back to Jobs/Interships
      </Link>

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8'>
        <div className='mb-4 sm:mb-0'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Job/Internship Setup
          </h1>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            Complete All Fields {completionText}
          </span>
        </div>
        <JobPublishActions
          jobId={params.jobId}
          isPublished={job?.isPusblished || false}
          disabled={!isComplete}
          user={user}
        />
      </div>

      {!job?.isPusblished && (
        <Banner
          variant='warning'
          label='This Job/Internship is unpublished. It will not be visible in the jobs/internships list'
          className='mb-8'
        />
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='space-y-8'>
          <SectionWrapper
            iconName='LayoutDashboard'
            title='Customize your Job/Internship Details'
          >
            <TitleForm initialData={job} jobId={job?.id} user={user} />
            <ImageForm initialData={job} jobId={job?.id} user={user} />
            <ShortDescription initialData={job} jobId={job?.id} user={user} />
            <ShiftTimingMode initialData={job} jobId={job?.id} user={user} />
            <JobSalaryForm initialData={job} jobId={job?.id} user={user} />
            <JobMode initialData={job} jobId={job?.id} user={user} />
            <WorkExperienceForm initialData={job} jobId={job?.id} user={user} />
          </SectionWrapper>
        </div>

        <div className='space-y-8'>
          <SectionWrapper iconName='ListChecks' title='Job/Internship Requirements'>
            <JobDepartment
              initialData={job}
              jobId={job?.id}
              user={user}
              departments={departments}
            />
          </SectionWrapper>

          <SectionWrapper iconName='File' title='Job/Internship Attachments'>
            <AttachmentsForm initialData={job} jobId={job?.id} user={user} />
          </SectionWrapper>
        </div>

        <div className='lg:col-span-2'>
          <SectionWrapper iconName='Building2' title='Job/Internship Description'>
            <JobDescription initialData={job} jobId={job?.id} user={user} />
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
