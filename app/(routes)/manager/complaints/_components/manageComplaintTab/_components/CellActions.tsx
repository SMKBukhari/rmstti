"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import DialogForm from "@/components/DialogForm";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeaveDeleteSchema } from "@/schemas";
import { UserProfile } from "@prisma/client";
import { Loader2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CellActionsProps {
  user: UserProfile | null;
  id: string;
}

const CellActions = ({ user, id }: CellActionsProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LeaveDeleteSchema>>({
    resolver: zodResolver(LeaveDeleteSchema),
    defaultValues: {
      agree: "",
    },
  });

  const agreeValue = form.watch("agree");

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/user/${user?.userId}/complaint/${id}`);
      toast.success(`Your request Deleted successfully.`);
      setDialogOpen(false);
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
      setDialogOpen(false);
      setIsLoading(false);
    }
  };

  const updateStatus = async (
    status: "In Progress" | "Rejected" | "Completed"
  ) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/user/${user?.userId}/complaint/${id}`, {
        status,
      });
      toast.success(`Complaint status updated to ${status}`);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data || "An error occurred. Please try again."
        );
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
      {/* <Button variant={"destructive"} onClick={() => setDialogOpen(true)}>
        Delete
      </Button> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            {isLoading ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <MoreHorizontal className='h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='w-full'>
            <Button
              variant='secondary'
              className='w-full'
              onClick={() => updateStatus("In Progress")}
            >
              {isLoading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                "Mark In Progress"
              )}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className='w-full'>
            <Button
              className='w-full'
              variant='destructive'
              onClick={() => updateStatus("Rejected")}
            >
              {isLoading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                "Reject"
              )}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className='w-full'>
            <Button
              variant='primary'
              className='w-full'
              onClick={() => updateStatus("Completed")}
            >
              {isLoading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                "Completed"
              )}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title={`Delete Leave Request`}
        description='Are you sure you want to delete this leave request?'
        fields={[
          {
            name: "agree",
            type: "input",
            label: "Are you sure you want to delete this leave request?",
            placeholder: "Type 'agree' to confirm",
          },
        ]}
        buttons={[
          {
            label: "Delete",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
            disabled: agreeValue !== "agree",
          },
          {
            label: "Cancel",
            type: "button",
            onClick: () => setDialogOpen(false),
          },
        ]}
        onSubmit={onSubmit}
        form={form}
      />
    </div>
  );
};

export default CellActions;
