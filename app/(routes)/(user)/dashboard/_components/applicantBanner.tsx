"use client";
import Banner from "@/components/Banner";

const ApplicantBanner = () => {
  return (
    <div>
      <Banner
        label={
          <>
            You have successfully applied. We will get back to you soon, until then keep learning and improving your skills. Good luck!
          </>
        }
        variant='success'
      />
    </div>
  );
};

export default ApplicantBanner;
