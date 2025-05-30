"use client";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { AddNewEmployeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department, Role, UserProfile } from "@prisma/client";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddNewEmployeeProps {
  user: UserProfile | null;
  department: Department[] | null;
  role: Role[] | null;
}

const AddNewEmployee = ({ user, department, role }: AddNewEmployeeProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof AddNewEmployeeSchema>>({
    resolver: zodResolver(AddNewEmployeeSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      gender: "Male",
      contactNumber: "",
      DOB: new Date(),
      department: "",
      designation: "",
      role: "",
      salary: "",
      DOJ: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof AddNewEmployeeSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/addNewEmployee`, {
        ...data,
      });
      console.log(data);
      toast.success(`Employee added successfully.`);
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
      <div className='flex w-full items-end justify-end'>
        <Button variant={"primary"} onClick={() => setDialogOpen(true)}>
          <Plus className='w-5 h-5 mr-2' /> Add New Employee
        </Button>
      </div>

      <DialogForm
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title='Add New Employee'
        description='Please fill in the details below to add a new employee.'
        fields={[
          {
            type: "input",
            name: "fullName",
            label: "Full Name",
            placeholder: "Enter full name",
          },
          {
            type: "input",
            name: "email",
            label: "Email",
            placeholder: "Enter email",
          },
          {
            type: "input",
            name: "password",
            label: "Password",
            placeholder: "Enter password",
          },
          {
            type: "select",
            name: "gender",
            label: "Gender",
            comboboxOptions: [
              {
                label: "Male",
                value: "Male",
              },
              {
                label: "Female",
                value: "Female",
              },
              {
                label: "Other",
                value: "Other",
              },
            ],
          },
          {
            type: "input",
            name: "contactNumber",
            label: "Contact Number",
            placeholder: "Enter contact number",
          },
          {
            type: "date",
            name: "DOB",
            label: "Date of Birth",
          },
          {
            type: "select",
            name: "department",
            label: "Department",
            comboboxOptions: department
              ? department.map((d) => ({ label: d.name, value: d.name }))
              : [],
          },
          {
            type: "input",
            name: "designation",
            label: "Designation",
            placeholder: "Enter designation",
          },
          {
            type: "select",
            name: "role",
            label: "Role",
            comboboxOptions: role
              ? role.map((r) => ({ label: r.name, value: r.name }))
              : [],
          },
          {
            type: "input",
            name: "salary",
            label: "Salary",
            placeholder: "Enter salary",
          },
          {
            type: "date",
            name: "DOJ",
            label: "Date of Joining",
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

export default AddNewEmployee;
