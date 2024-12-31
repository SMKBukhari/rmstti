"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DepartmentsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department, Skills, UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2, Plus, X } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GeneralTabCreateDepartmentsProps {
  user: (UserProfile & { skills: Skills[] }) | null;
  departments: (Department & { users: UserProfile[] })[];
}

const CreateDepartments = ({
  user,
  departments,
}: GeneralTabCreateDepartmentsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const toggleEditing = (skillId?: string) => {
    if (skillId) {
      setEditingSkillId(skillId);
      setIsEditing(true);
    } else {
      setIsEditing((prev) => !prev);
      setEditingSkillId(null);
    }
  };
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof DepartmentsSchema>>({
    resolver: zodResolver(DepartmentsSchema),
  });

  const cancelEditing = () => {
    setEditingSkillId(null); // Clear the editing experience ID
  };

  const { isSubmitting, isValid } = form.formState;
  

  const onSubmit = async (values: z.infer<typeof DepartmentsSchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/departments`, {
        name: values.name,
      });
      toast.success(`New Department added.`);
      toggleEditing();
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

  const saveSkill = async (values: z.infer<typeof DepartmentsSchema>) => {
    try {
      // Update existing experience via API call
      await axios.patch(
        `/api/user/${user?.userId}/departments/${editingSkillId}`,
        { departments: [values] }
      );
      toast.success(`${user?.fullName} Experience updated successfully.`);
      cancelEditing(); // Reset editing state
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  const onDelete = async (department: Department) => {
    try {
      setDeletingId(department.id);

      await axios.delete(
        `/api/user/${user?.userId}/departments/${department.id}`
      );
      toast.success(
        `${department.name} department has been deleted successfully from your organization.`
      );
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
      setDeletingId(null);
    }
  };
  return (
    <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5 mb-5'>
      <div className='flex justify-between w-full'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Departments
          <span className='text-red-500 ml-1'>*</span>
        </h2>
        <Button onClick={() => toggleEditing()} variant={"primary"}>
          {isEditing || editingSkillId ? (
            <div className=''>Cancel</div>
          ) : (
            <div className='text-white dark:text-white hover:font-semibold flex items-center'>
              <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
              Add
            </div>
          )}
        </Button>
      </div>
      {!isEditing && !editingSkillId ? (
        departments?.length === 0 ? (
          <div className="flex justify-center items-center">
            <div className="text-neutral-400 flex justify-center items-center flex-col">
              <p>No departments added yet</p>
              <p className="text-sm text-neutral-500">
                You need to add departments for your organization.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {departments?.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="text-2xl font-bold mb-2">{item.users.length}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Form {...form}>
          <form
            className='space-y-8 w-full'
            onSubmit={form.handleSubmit(isEditing ? onSubmit : saveSkill)}
          >
            <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Department</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'IT Department'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex items-center gap-x-2'>
              {isLoading ? (
                <Button
                  variant={"primary"}
                  disabled={!isValid || isSubmitting}
                  typeof='submit'
                >
                  <Loader2 className='h-5 w-5 text-primary animate-spin' />
                </Button>
              ) : (
                <Button
                  variant={"primary"}
                  disabled={!isValid || isSubmitting}
                  typeof='submit'
                >
                  Save
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </Card>
  );
};

export default CreateDepartments;

