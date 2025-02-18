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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/user/${user?.userId}/publicHolidays/${id}`);
      toast.success(`Holiday Deleted Successfully.`);
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
        variant={"destructive"}
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <span>Delete</span>
        )}
      </Button>
    </div>
  );
};

export default CellActions;
