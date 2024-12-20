"use client";
import Banner from "@/components/Banner";
import Link from "next/link";

interface UserBannerWarningProps {
    completedFields: number;
    totalFields: number;
}

const UserBannerWarning = ({completedFields, totalFields}:UserBannerWarningProps) => {
  return (
    <div>
      <Banner
            label={
              <>
                You have completed {completedFields} out of {totalFields} fields
                required for applying. Go to{" "}
                <Link href='/settings' className='underline underline-offset-1'>
                  Account Settings
                </Link>{" "}
                to complete the remaining fields.
              </>
            }
            variant='warning'
            buttonLink={{
              label: "Go to Account",
              link: "/settings",
            }}
          />
    </div>
  );
};

export default UserBannerWarning;
