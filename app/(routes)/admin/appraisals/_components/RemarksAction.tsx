"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface RemarksActionProps {
  commentsOnOverallPerformance?: string;
  specificAdviceToTheEmployee?: string;
}

const RemarksAction = ({
  commentsOnOverallPerformance,
  specificAdviceToTheEmployee,
}: RemarksActionProps) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant='outline' className='w-full'>
            View Remarks
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appraisal Remarks</DialogTitle>
            <DialogDescription>
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='performance'>
                  <AccordionTrigger>
                    Comments on Overall Performance
                  </AccordionTrigger>
                  <AccordionContent>
                    {commentsOnOverallPerformance || "No remarks provided."}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='advice'>
                  <AccordionTrigger>
                    Specific Advice to the Employee
                  </AccordionTrigger>
                  <AccordionContent>
                    {specificAdviceToTheEmployee || "No advice provided."}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RemarksAction;
