import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { configurationTabs } from "@/lib/data";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import SettingsTab from "./_components/settingsTab/page";
import GeneralTabPage from "./_components/generalTab/page";

const SettingsPage = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  if (!userId) {
    redirect("/signIn");
  }

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      role: true,
      jobExperience: true,
      education: true,
      skills: true,
    },
  });

  const departments = await db.department.findMany({
    include: {
      users: true,
    },
  });

  const departmentsWithUsers = departments.map((department) => ({
    ...department,
    users: department.users || [],
  }));

  const userWithJobExperiences = user
    ? {
        ...user,
        jobExperiences: user.jobExperience || [],
        userId: user.userId || "", // Ensure `userId` is a string
      }
    : null;

  const userWithEducations = user
    ? { ...user, educations: user.education || [] }
    : null;

  const userWithSkills = user ? { ...user, skills: user.skills || [] } : null;

  return (
    <div>
      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='bg-transparent gap-10'>
          {configurationTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='px-8 py-3 text-base data-[state=active]:bg-[#295B81] data-[state=active]:dark:bg-[#1034ff] rounded-md dark:shadow-white dark:text-[#fff] data-[state=active]:text-[#fff] text-neutral-800 font-medium'
            >
              <div className='flex gap-2 items-center justify-center w-full'>
                <tab.icon className='w-5 h-5' />
                {tab.label}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='mt-8'>
          <TabsContent value='general'>
            <GeneralTabPage
              user={user}
              departments={departmentsWithUsers}
              userExperiences={userWithJobExperiences}
              userEducation={userWithEducations}
              userSkills={userWithSkills}
            />
          </TabsContent>
          <TabsContent value='security'>
            <SettingsTab user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;