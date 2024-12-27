import { UserProfile } from "@prisma/client";
import ChangePassword from "./_components/changeUserPassword";
import ChangeEmail from "./_components/changeUserEmail";
import { Card } from "@/components/ui/card";

interface SettingsTabProps {
  user: UserProfile | null;
}

const SettingsTab = ({ user, }: SettingsTabProps) => {
  return (
    <>
      <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Change Password
        </h2>
        <ChangePassword user={user} />
      </Card>
      <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Change Email
        </h2>
        <ChangeEmail user={user} />
      </Card>
      
    </>
  );
};

export default SettingsTab;
