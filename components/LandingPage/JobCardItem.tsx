"use client";

import { Job, JobApplications, UserProfile } from "@prisma/client";
import { Card, CardDescription } from "@/components/ui/card";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { formatedString } from "@/lib/utils";
import Image from "next/image";
import { truncate } from "lodash";
import Box from "../Box";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JobCardItemProps {
  job: Job;
  isComplete?: boolean;
  userProfile?: (UserProfile & { JobApplications: JobApplications[] }) | null;
}

const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "1",
    label: "0-2 years",
  },
  {
    value: "2",
    label: "2-5 years",
  },
  {
    value: "3",
    label: "5-10 years",
  },
  {
    value: "4",
    label: "10+ years",
  },
];

const JobCardItem = ({ job, isComplete, userProfile }: JobCardItemProps) => {
  const getExperienceLabel = (years: string) => {
    const experience = experienceData.find((exp) => exp.value === years);
    return experience ? experience.label : "NA";
  };
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const hasApplied = userProfile?.JobApplications.some(
    (application) => application.jobId === job.id
  );

  const onApply = async () => {
    setIsLoading(true);
    const sessionToken = Cookies.get("sessionToken");
    const userId = Cookies.get("userId");

    if (!userId || !sessionToken) {
      setIsLoading(false);
      router.push("/signIn");
    }

    if (sessionToken) {
      // Check if the session token has expired
      // const sessionExpiry = localStorage.getItem("sessionExpiry");
      const sessionExpiry = Cookies.get("sessionExpiry");
      if (sessionExpiry && new Date(sessionExpiry) > new Date()) {
        // If session is still valid, redirect to the dashboard
        setIsLoading(false);
        router.push(`/dashboard/${job.id}`);
      } else {
        setIsLoading(false);
        router.push("/signIn");
      }
    }
  };

  return (
    <motion.div layout onClick={onApply} className='cursor-pointer'>
      <Card className='bg-white dark:bg-gray-800'>
        <div className='w-full h-full p-4 flex flex-col items-start justify-start gap-y-4'>
          {/* Saved Job By User */}
          <Box>
            <p className='text-sm text-muted-foreground'>
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </p>
          </Box>

          {/* Company Details */}
          <Box className='items-center justify-start gap-x-4'>
            <div className='w-12 h-12 min-w-12 min-h-12 border-white border rounded-md p-2 relative flex items-center justify-center overflow-hidden'>
              {/* {company?.logo && ( */}
              <Image
                src={"/img/logo.png"}
                alt={"The Truth International"}
                // width={40}
                // height={40}
                fill
                className='object-contain'
              />
              {/* )} */}
            </div>

            <div className='w-full'>
              <p className='font-semibold text-base w-full truncate'>
                {truncate(job?.title, {
                  length: 25,
                  omission: "...",
                })}
              </p>
              <p className='text-xs text-foreground w-full truncate'>
                {job.department}
              </p>
            </div>
          </Box>

          {/* Job Details */}
          <Box className='flex-wrap'>
            {job?.shiftTiming && (
              <div className='text-xs text-muted-foreground flex items-center'>
                <BriefcaseBusiness className='w-3 h-3 mr-1' />
                {formatedString(job.shiftTiming)}
              </div>
            )}
            {job?.workMode && (
              <div className='text-xs text-muted-foreground flex items-center'>
                <Layers className='w-3 h-3 mr-1' />
                {formatedString(job.workMode)}
              </div>
            )}
            {job?.salary && (
              <div className='text-xs text-muted-foreground flex items-center'>
                <Currency className='w-3 h-3 mr-1' />
                {`Rs. ${formatedString(job?.salary)}/month`}
              </div>
            )}
            {job.yearsOfExperience && (
              <div className='text-xs text-muted-foreground flex items-center'>
                <Network className='w-3 h-3 mr-1' />
                {getExperienceLabel(job.yearsOfExperience)}
              </div>
            )}
          </Box>

          {/* Job Short Description */}
          {job.shortDescription && (
            <CardDescription className='text-xs'>
              {truncate(job.shortDescription, {
                length: 180,
                omission: "...",
              })}
            </CardDescription>
          )}

          {/* Action Buttons */}
          <Box className='gap-2 mt-auto'>
            <Button
              className='w-full'
              variant={"default"}
              onClick={onApply}
              disabled={!isComplete || hasApplied}
            >
              {isloading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                "Apply Now"
              )}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCardItem;
