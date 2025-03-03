"use client";
import Preview from "@/components/PreviewEditorText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile, Warnings } from "@prisma/client";
import { NotepadText } from "lucide-react";

interface WarningEmployeesProps {
  warnings: (Warnings & { user: UserProfile | null })[] | null;
}

const WarningEmployees = ({ warnings }: WarningEmployeesProps) => {
  return (
    <>
      <Card>
        <CardHeader className='flex h-full flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Warnings</CardTitle>
          <NotepadText className='w-6 h-6' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {warnings && warnings.length > 0 ? warnings.length : 0}
          </div>
          <div className='mt-5'>
            {warnings && warnings.length > 0 ? (
              <Accordion type='single' collapsible className='w-full'>
                {warnings.map((warning) => (
                  <AccordionItem value={warning.id} key={warning.id}>
                    <AccordionTrigger className='hover:no-underline'>
                      <div className='py-2 flex flex-1 text-left gap-3 w-full px-3 rounded-lg'>
                        <Avatar className='h-12 w-12 rounded-lg'>
                          <AvatarImage
                            className='w-full rounded-full h-full object-cover object-center'
                            src={warning.user?.userImage || ""}
                            alt={warning.user?.fullName || ""}
                          />
                          <AvatarFallback className='rounded-full'>
                            {warning.user?.fullName
                              ?.slice(0, 2)
                              ?.toUpperCase() || "CN"}
                          </AvatarFallback>
                        </Avatar>
                        <div className='ml-3'>
                          <div className='text-base font-semibold'>
                            {warning.user?.fullName || ""}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {warning.title}
                            <div>
                              <span className='text-sm text-gray-500'>
                                {warning.createdAt.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex-1 text-right'>
                          {warning.isRead ? (
                            <div className='text-sm text-gray-500'>Read</div>
                          ) : (
                            <div className='text-sm text-red-500'>Unread</div>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Preview value={warning.message} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className='text-sm text-gray-500'>No Warnings</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WarningEmployees;
