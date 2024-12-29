import { Separator } from "@/components/ui/separator";
import { JobApplications,  UserProfile } from "@prisma/client";

interface UserCoverLetterSectionProps {
  userJobApplications:
    | (UserProfile & { jobApplications: JobApplications[] })
    | null;
}

const UserCoverLetterSection = ({
  userJobApplications,
}: UserCoverLetterSectionProps) => {
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Cover Letter
          </h3>
          <Separator />
          {userJobApplications?.jobApplications?.length ? (
            userJobApplications.jobApplications.map((application, index) => (
              <div key={index} className='flex gap-2'>
                <p className='text-muted-foreground text-base text-justify'>
                  {application.coverLetter || "No cover letter provided."}
                </p>
              </div>
            ))
          ) : (
            <p className='text-muted-foreground text-base'>
              No cover letters available for this Applicant.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserCoverLetterSection;
