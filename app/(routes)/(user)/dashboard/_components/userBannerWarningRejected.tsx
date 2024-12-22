"use client";
import Banner from "@/components/Banner";

const UserBannerWarningRejected = () => {
  return (
    <div>
      <Banner
        label={
          <>
            We regret to inform you that your application has not been
            successful at this time. However, we encourage you to continue
            pursuing opportunities that align with your skills and aspirations.
            We saved your resume for future reference.
          </>
        }
        variant='warning'
      />
    </div>
  );
};

export default UserBannerWarningRejected;
