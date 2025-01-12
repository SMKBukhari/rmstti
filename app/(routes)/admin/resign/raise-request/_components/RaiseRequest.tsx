"use client";

import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { LeaveRequestSchema, ResignationRequestSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { company, Department, Role, UserProfile } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface RaiseRequestProps {
  user:
    | (UserProfile & { role: Role | null } & {
        department: Department | null;
      } & { company: company | null })
    | null;
}

const RaiseRequest = ({ user }: RaiseRequestProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const defaultLetterContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="font-size: 20px; margin-bottom: 15px;">Dear CEO,</h2>
    <p style="margin-bottom: 15px;">
      I am writing to formally submit my resignation from my position as <strong>${
        user?.designation
      }</strong> at <strong>${
    user?.company?.name
  }</strong>, effective <strong>${new Date().toLocaleDateString()}</strong>. This decision was not made lightly, 
      as my time at <strong>${
        user?.company?.name
      }</strong> has been immensely rewarding both professionally and personally.
    </p>
    <p style="margin-bottom: 15px;">
      I am incredibly grateful for the opportunities I have had during my tenure, especially the chance to work under 
      your inspiring leadership. Your vision and guidance have profoundly shaped my professional growth, and I will always 
      value the experience I gained as part of this organization.
    </p>
    <p style="margin-bottom: 15px;">
      During this transition period, I am committed to ensuring a smooth handover of my responsibilities. I am prepared to 
      assist with training my replacement, documenting my tasks, or offering any other support needed to maintain the 
      team's momentum.
    </p>
    <p style="margin-bottom: 15px;">
      I sincerely appreciate the trust and encouragement you have provided throughout my journey at <strong>${
        user?.company?.name
      }</strong>. 
      The lessons and relationships I have built here will stay with me as I move forward to pursue <em>[brief mention of new goals, e.g., personal growth, new career opportunities, etc.]</em>.
    </p>
    <p style="margin-top: 20px;">
      Thank you once again for your support and understanding. I look forward to staying in touch and wish continued success 
      to you and <strong>${user?.company?.name}</strong>.
    </p>
    <p style="margin-top: 60px;">
      Sincerely,<br/>
      <strong>${user?.fullName}</strong><br/>
      ${user?.email}<br/>
      ${user?.contactNumber}<br/>
      ${user?.address}
    </p>
  </div>`;

  const form = useForm<z.infer<typeof ResignationRequestSchema>>({
    resolver: zodResolver(LeaveRequestSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      role: user?.role?.name ?? "",
      department: user?.department?.name ?? "",
      designation: user?.designation ?? "",
      date: new Date(),
      reason: defaultLetterContent,
    },
  });

  const onSubmit = async (data: z.infer<typeof ResignationRequestSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(
        `/api/user/${user?.userId}/employeeRaiseResignationRequest`,
        {
          ...data,
        }
      );
      console.log(data);
      toast.success(`Resignation request submitted successfully.`);
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
        title={`Raise Resignation Request`}
        description='Please fill in the details below to raise a resignation request.'
        fields={[
          {
            name: "fullName",
            label: "Full Name",
            type: "input",
            disabled: true,
          },
          {
            name: "role",
            label: "Role",
            type: "input",
            disabled: true,
          },
          {
            name: "department",
            label: "Department",
            type: "input",
            disabled: true,
          },
          {
            name: "designation",
            label: "Designation",
            type: "input",
            disabled: true,
          },
          {
            name: "date",
            label: "Date",
            type: "date",
            disabled: true,
          },
          {
            name: "reason",
            label: "Reason",
            type: "richtextarea",
          },
        ]}
        buttons={[
          {
            label: "Submit Request",
            type: "submit",
            variant: "primary",
            isLoading: isLoading,
            onClick: () => onSubmit(form.getValues()),
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

export default RaiseRequest;
