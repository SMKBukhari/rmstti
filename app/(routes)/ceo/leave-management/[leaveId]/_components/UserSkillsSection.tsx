import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skills, UserProfile } from "@prisma/client";

interface UserSkillsSectionProps {
  user: (UserProfile & { skills: Skills[] | null }) | null;
}

const UserSkillsSection = ({ user }: UserSkillsSectionProps) => {
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Skills
          </h3>
          <Separator />
          <div className="flex flex-wrap gap-3">
            {user?.skills?.length ? (
              user?.skills?.map((item) => (
                <div className='flex flex-wrap gap-3' key={item.id}>
                  <div className='flex'>
                    <div className='flex text-white justify-center bg-[#295B81] dark:bg-[#1034ff] rounded-md p-2 gap-2 items-center'>
                      <div className='flex'>
                        <div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>{item.name}</TooltipTrigger>
                              <TooltipContent>
                                <p>{item.experienceLevel}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-base'>
                No skills available for this Applicant.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserSkillsSection;
