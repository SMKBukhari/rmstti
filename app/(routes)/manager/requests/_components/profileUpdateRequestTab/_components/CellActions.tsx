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
  status: string;
}

const CellActions = ({ user, id, status }: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isRejection, setIsRejection] = useState(false);

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/employeeDataUpdateRequest/approve", {
        requestId: id,
        userId: user?.userId,
      });
      toast.success("Profile update request approved successfully");
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to approve profile update request", error);
      toast.error("Failed to approve profile update request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejection(true);
      await axios.post("/api/employeeDataUpdateRequest/reject", {
        requestId: id,
        userId: user?.userId,
      });
      toast.success("Profile update request rejected successfully");
      router.refresh();
      setIsRejection(false);
    } catch (error) {
      console.error("Failed to reject profile update request", error);
      toast.error("Failed to reject profile update request");
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
        onClick={handleApprove}
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
        onClick={handleReject}
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
