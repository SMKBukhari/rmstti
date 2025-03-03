"use client";
import Preview from "@/components/PreviewEditorText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { UserProfile, Warnings } from "@prisma/client";
import { NotepadText } from "lucide-react";
import { useState } from "react";

interface WarningEmployeesProps {
  warnings: (Warnings & { user: UserProfile | null })[] | null;
}

const WarningEmployees = ({ warnings }: WarningEmployeesProps) => {
  const [showWarning, setShowWarning] = useState(false);
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
              warnings.map((warning) => (
                <div
                  className='py-2 flex items-center gap-3 cursor-pointer hover:bg-black/50 w-full px-3 rounded-lg'
                  key={warning.id}
                  onClick={() => setShowWarning(true)}
                >
                  <Avatar className='h-12 w-12 rounded-lg'>
                    <AvatarImage
                      className='w-full rounded-full h-full object-cover object-center'
                      src={warning.user?.userImage || ""}
                      alt={warning.user?.fullName || ""}
                    />
                    <AvatarFallback className='rounded-full'>
                      {warning.user?.fullName?.slice(0, 2)?.toUpperCase() ||
                        "CN"}
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
                  <Dialog open={showWarning} onOpenChange={setShowWarning}>
                    <DialogContent>
                      <DialogHeader>
                        <h2>{warning.title}</h2>
                      </DialogHeader>
                      <Preview value={warning.message} />
                      <DialogFooter>
                        <Button onClick={() => setShowWarning(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
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
