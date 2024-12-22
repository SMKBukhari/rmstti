"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@prisma/client";

interface CellActionsProps {
  user: UserProfile | null;
  id: string;
  fullName: string;
  email: string;
}

const CellActions = ({ user, id, fullName, email }: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `/api/user/${user?.userId}/shortlistRejectedApplication`,
        {
          applicantId: id,
        }
      );
      toast.success(
        `Applicant ${fullName} has been shortlisted successfully.`
      );
      setIsLoading(false);
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the row
  };

  return (
    <div className='flex gap-3' onClick={handleButtonClick}>
      <Button
        variant={"outline"}
        className='bg-transparent border-white'
        onClick={onSubmit}
      >
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
        ) : (
          <span>Shortlist</span>
        )}
      </Button>
    </div>
  );
};

export default CellActions;
