"use client";
import Banner from "@/components/Banner";
import { format } from "date-fns";

interface ApplicantInterviewBannerProps {
    interviewDateTime: Date | null;
}

const ApplicantInterviewBanner = ({interviewDateTime}:ApplicantInterviewBannerProps) => {
  return (
    <div>
      <Banner
        label={
            interviewDateTime ? (
                <>
                  Your interview has been scheduled on{" "}
                  <strong>
                    {format(new Date(interviewDateTime), "PPPP 'at' p")}
                  </strong>
                  . Please be prepared and good luck!
                </>
              ) : (
                "Your interview date is not available. Please contact support."
              )
        }
        variant='success'
      />
    </div>
  );
};

export default ApplicantInterviewBanner;
