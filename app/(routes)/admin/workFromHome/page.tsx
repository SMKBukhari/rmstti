import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workFromHomeTabs } from "@/lib/data";
import React from "react";
import RaiseLeaveRequest from "./_components/raise-requests/page";
import ManageLeaveRequests from "./_components/manage-requests/page";

const LeaveManagementPage = () => {
  return (
    <div>
      <Tabs defaultValue='raiseRequests' className='w-full'>
        <TabsList className='bg-transparent gap-10'>
          {workFromHomeTabs.map((tab) => (
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
          <TabsContent value='raiseRequests'>
            <RaiseLeaveRequest />
          </TabsContent>
          <TabsContent value='manageRequests'>
            <ManageLeaveRequests />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LeaveManagementPage;
