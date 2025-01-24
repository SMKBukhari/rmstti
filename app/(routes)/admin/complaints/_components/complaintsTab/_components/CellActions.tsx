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
      toast.success(`Your Complaint Deleted successfully.`);
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

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the row
  };

  return (
    <div className='flex gap-3' onClick={handleButtonClick}>
      <Button variant={"destructive"} onClick={() => setDialogOpen(true)}>
        Delete
      </Button>

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
