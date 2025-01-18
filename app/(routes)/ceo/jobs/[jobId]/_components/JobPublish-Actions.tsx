"use client";

import { Button } from "@/components/ui/button";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface JobPublishActionsProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
  user: UserProfile | null;
}

const JobPublishActions = ({
  disabled,
  jobId,
  isPublished,
  user,
}: JobPublishActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/user/${user?.userId}/createNewJob/${jobId}/unpublish`
        );
        toast.success(`Job Un-Published Successfully!`);
      } else {
        await axios.patch(
          `/api/user/${user?.userId}/createNewJob/${jobId}/publish`
        );
        toast.success(`Job Published Successfully!`);
      }

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

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/user/${user?.userId}/createNewJob/${jobId}`);

      router.refresh();
      return router.push("/ceo/jobs");
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

  return (
    <div className='flex items-center gap-x-3'>
      <Button
        variant={"primary"}
        // className="border-[#0AAB7C] text-[#0AAB7C]"
        size={"sm"}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={isLoading}
        onClick={onDelete}
      >
        <Trash className='w-4 h-4' />
      </Button>
    </div>
  );
};
export default JobPublishActions;
