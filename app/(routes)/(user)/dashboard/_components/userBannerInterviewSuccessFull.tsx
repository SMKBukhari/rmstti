"use client";
import Banner from "@/components/Banner";

const UserBannerInterviewSuccess = () => {
  return (
    <div>
      <Banner
        label={<>Please be connected with us. We will reach out to you soon.</>}
        variant='success'
      />
    </div>
  );
};

export default UserBannerInterviewSuccess;
