import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import OTPInput from "./_components/otpInput";

const VerifyAccount = async ({ params }: { params: { userId: string } }) => {

  const user = await db.userProfile.findUnique({
    where: {
      userId: params.userId,
      isVerified: false,
    },
  });

  if (!user) {
    return redirect("/signIn");
  }

  return (
    <div className='w-[100vw] flex flex-col items-center justify-center h-full'>
      <OTPInput userId={user.userId} />
    </div>
  );
};

export default VerifyAccount;
