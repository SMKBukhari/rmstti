"use client";
import Banner from "@/components/Banner";
import Preview from "@/components/PreviewEditorText";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";

interface EmployeeBannerWarningProps {
  warningTitle: string;
  warningMessage: string;
  senderDesignation: string;
}

const EmployeeBannerWarning = ({
  warningTitle,
  warningMessage,
  senderDesignation,
}: EmployeeBannerWarningProps) => {
  const [showWarning, setShowWarning] = useState(false);
  return (
    <div className='mb-10'>
      <Banner
        label={
          <>
            You have a warning today from {senderDesignation}:{" "}
            <strong>{warningTitle}</strong>
            <Button variant={"link"} onClick={() => setShowWarning(true)}>
              Check Warning
            </Button>
          </>
        }
        variant='warning'
        button={{
          label: "Check Warning",
          onClick: () => setShowWarning(true),
        }}
      />

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <h2>{warningTitle}</h2>
          </DialogHeader>
          <Preview value={warningMessage} />
          <DialogFooter>
            <Button onClick={() => setShowWarning(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeBannerWarning;
