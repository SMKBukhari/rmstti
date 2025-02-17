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
}

const CellActions = ({ user, id }: CellActionsProps) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (status: "Approved" | "Rejected") => {
    try {
      if (status === "Approved") setIsAcceptLoading(true);
      if (status === "Rejected") setIsRejectLoading(true);

      await axios.patch(
        `/api/user/${user?.userId}/employeeRaiseResignationRequest/${id}`,
        { status }
      );
      toast.success(`Resignation request ${status.toLowerCase()} successfully.`);
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
      if (status === "Approved") setIsAcceptLoading(false);
      if (status === "Rejected") setIsRejectLoading(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the row
  };

  return (
    <div className="flex gap-3" onClick={handleButtonClick}>
      <Button
        variant={"primary"}
        onClick={() => handleAction("Approved")}
        disabled={isAcceptLoading}
      >
        {isAcceptLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Accept"}
      </Button>

      <Button
        variant={"destructive"}
        onClick={() => handleAction("Rejected")}
        disabled={isRejectLoading}
      >
        {isRejectLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Reject"}
      </Button>
    </div>
  );
};

export default CellActions;
