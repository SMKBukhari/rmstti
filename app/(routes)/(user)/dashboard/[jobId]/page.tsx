import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import JobDetailsPageComponent from "./_components/JobDetailsPageComponent";
import { cookies } from "next/headers";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      applications: true,
      attachments: true,
    },
  });

  if (!job) {
    redirect("/dashboard");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      JobApplications: true,
      jobExperience: true,
      education: true,
    },
  });

  const requiredFieldsForApply = [
    profile?.fullName,
    profile?.email,
    profile?.contactNumber,
    profile?.city,
    profile?.country,
    profile?.jobExperience,
    profile?.education.length,
    profile?.resumeUrl,
  ];

  const totalFields = requiredFieldsForApply.length;
  const completedFields = requiredFieldsForApply.filter(Boolean).length;
  const isComplete = requiredFieldsForApply.every(Boolean);

  return (
    <div className='flex-col p-4 md:p-8'>
      <JobDetailsPageComponent
        job={job}
        jobId={job.id}
        userProfile={profile}
        completedFields={completedFields}
        totalFields={totalFields}
        isComplete={isComplete}
      />
    </div>
  );
};

export default JobDetailsPage;
