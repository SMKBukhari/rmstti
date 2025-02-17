import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resignationManagementTabs } from "@/lib/data";
import React from "react";
import ManageResignationPage from "./_components/manage-resignations/page";
import RaiseRequestsPage from "./_components/raise-request/page";

const ResignationManagementPage = () => {
  return (
    <div>
      <Tabs defaultValue='raiseRequests' className='w-full'>
        <TabsList className='bg-transparent gap-10'>
          {resignationManagementTabs.map((tab) => (
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
            <ManageResignationPage />
          </TabsContent>
          <TabsContent value='manageRequests'>
            <RaiseRequestsPage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ResignationManagementPage;
