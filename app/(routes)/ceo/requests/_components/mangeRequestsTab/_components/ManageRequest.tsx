"use client";

import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { RequestsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestCategory, Role, UserProfile } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ManageRequestProps {
  user: UserProfile | null;
  requestCatogries: RequestCategory[] | null;
  requestTo: (UserProfile & { role: Role | null })[] | null;
}

const ManageRequest = ({
  user,
  requestCatogries,
  requestTo,
}: ManageRequestProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof RequestsSchema>>({
    resolver: zodResolver(RequestsSchema),
    defaultValues: {
      requestTo: "",
      category: "",
      requestMessage: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RequestsSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/requests`, {
        ...data,
      });
      console.log(data);
      toast.success(
        `Your request for ${data.category} sent successfully. Wait for the response.`
      );
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
  return (
    <>
      <div className='flex w-full items-end justify-end mt-6'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Plus className='w-5 h-5 mr-2' /> Raise Request
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Raise Request'
        description='Please fill the form below to raise a request.'
        fields={[
          {
            label: "Request To",
            name: "requestTo",
            type: "select",
            comboboxOptions: requestTo
              ? requestTo.map((user) => ({
                  label: `${user.fullName} - ${user.role?.name}`,
                  value: user.userId,
                }))
              : [],
          },
          {
            label: "Category",
            name: "category",
            type: "select",
            comboboxOptions: requestCatogries
              ? requestCatogries.map((category) => ({
                  label: category.name,
                  value: category.name,
                }))
              : [],
          },
          {
            label: "Request Message",
            name: "requestMessage",
            type: "richtextarea",
          },
        ]}
        buttons={[
          {
            label: "Submit Request",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
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
    </>
  );
};

export default ManageRequest;
