"use client";
import { UserProfile } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface UserResumeSectionProps {
  user: UserProfile | null;
}


const UserResumeSection = ({ user }: UserResumeSectionProps) => {
  const [isResumeLoading, setIsResumeLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string>("");

  useEffect(() => {
    setIsResumeLoading(true);
    if (user?.resumeUrl || "".includes("cloudinary.com")) {
      setIframeUrl(
        `${user?.resumeUrl || ""}#toolbar=0&navpanes=0&scrollbar=0`
      );
    } else {
      setIframeUrl(user?.resumeUrl || "");
    }
  }, [user?.resumeUrl]);

  const handleIframeLoad = () => {
    setIsResumeLoading(false);
  };
  return (
    <main>
      <div className='w-full flex flex-col gap-10 px-5 py-10 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5'>
        <div className='flex flex-col gap-4'>
          <h3 className='uppercase text-neutral-600 dark:text-neutral-400 text-sm font-semibold tracking-wider'>
            Resume
          </h3>
          <Separator />
          {user?.resumeUrl ? (
             <div className="pdf-preview w-full h-[600px] relative border border-gray-300 rounded-lg overflow-hidden">
             {isResumeLoading && (
               <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                 <div className="text-center">
                   <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
                   <p className="mt-2 text-gray-600 dark:text-gray-400">Loading Resume...</p>
                 </div>
               </div>
             )}
             {iframeUrl && (
               <iframe
                 src={iframeUrl}
                 className="w-full h-full border-none"
                 title="Resume Preview"
                 onLoad={handleIframeLoad}
               />
             )}
           </div>
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
