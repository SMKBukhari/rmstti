"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserProfile } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface CellActionsProps {
  user: UserProfile | null;
  id: string;
  fullName: string;
  email: string;
  status: string;
}

const CellActions = ({ user, id, fullName, status }: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isRejection, setIsRejection] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.patch(
        `/api/user/${user?.userId}/adminLeaveManagement/${id}/approve`
      );
      toast.success(`Leave request for ${fullName} approved successfully.`);
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

  const onReject = async () => {
    try {
      setIsRejection(true);
      await axios.patch(
        `/api/user/${user?.userId}/adminLeaveManagement/${id}/reject`
      );
      toast.success(`Leave request for ${fullName} rejected successfully.`);
      setIsRejection(false);
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
      setIsRejection(false);
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
        disabled={status === "Approved"}
      >
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin dark:text-[#1034ff] text-[#295B81]' />
        ) : (
          <span>Approve</span>
        )}
      </Button>
      <Button
        variant={"destructive"}
        onClick={onReject}
        disabled={status === "Rejected"}
      >
        {isRejection ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <span>Reject</span>
        )}
      </Button>
    </div>
  );
};

export default CellActions;
