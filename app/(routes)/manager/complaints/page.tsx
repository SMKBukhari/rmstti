import React from "react";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { complaintsTabs } from "@/lib/data";
import ManageRequestsTabs from "./_components/manageComplaintTab/page";
import RaiseComplaintTab from "./_components/complaintsTab/page";

const RequestsTabs = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value;

  const user = await db.userProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  return (
    <div>
      <Tabs defaultValue='raiseComplaints' className='w-full'>
        <TabsList className='bg-transparent gap-10'>
          {complaintsTabs.map((tab) => (
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
          <TabsContent value='raiseComplaints'>
            <RaiseComplaintTab />
          </TabsContent>
          <TabsContent value='manageComplaints'>
            <ManageRequestsTabs />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default RequestsTabs;
