"use client";
import { UserProfile } from "@prisma/client";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { pdfjs } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Separator } from "@/components/ui/separator";

interface UserResumeSectionProps {
  user: UserProfile | null;
}

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/pnpm/pdfjs-dist@4.9.155/build/pdf.worker.min.js";

const UserResumeSection = ({ user }: UserResumeSectionProps) => {
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Resume
          </h3>
          <Separator />
          {user?.resumeUrl ? (
            <Worker workerUrl='https://cdn.jsdelivr.net/pnpm/pdfjs-dist@4.9.155/build/pdf.worker.min.js'>
              <Viewer enableSmoothScroll fileUrl={user?.resumeUrl || ""} />
            </Worker>
          ) : (
            <p className='text-muted-foreground text-base'>
              No resume provided.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserResumeSection;
