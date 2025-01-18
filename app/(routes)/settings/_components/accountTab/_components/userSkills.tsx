"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ComboBox from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExperienceLevels } from "@/lib/data";
import { UserSkills } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skills, UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2, Plus, X } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AccountTabUserSkillsProps {
  user: (UserProfile & { skills: Skills[] }) | null;
}

const UserSkillss = ({ user }: AccountTabUserSkillsProps) => {
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

  const form = useForm<z.infer<typeof UserSkills>>({
    resolver: zodResolver(UserSkills),
  });

  const cancelEditing = () => {
    setEditingSkillId(null); // Clear the editing experience ID
  };

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof UserSkills>) => {
    if (!values || !values.name || !values.experienceLevel) {
      toast.error("Please fill out all fields before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`/api/user/${user?.userId}/userSkills`, { skills: [values] });
    
      if (response.data.createdSkills && response.data.createdSkills.length > 0) {
        toast.success("New Skill(s) added.");
        toggleEditing();
        router.refresh();
      } else {
        toast.info(response.data.message || "No new skills were added.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.error || "An unexpected error occurred. Please try again.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const saveSkill = async (values: z.infer<typeof UserSkills>) => {
    try {
      // Update existing experience via API call
      await axios.patch(
        `/api/user/${user?.userId}/userSkills/${editingSkillId}`,
        { skills: [values] }
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

  const onDelete = async (skill: Skills) => {
    try {
      setDeletingId(skill.id);

      await axios.delete(`/api/user/${user?.userId}/userSkills/${skill.id}`);
      toast.success(
        `${user?.fullName}, "${skill.name}" deleted from your skills.`
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
          Skills
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
        user?.skills?.length === 0 ? (
          <div className='flex justify-center items-center'>
            <div className="text-neutral-400 flex justify-center items-center flex-col">
              <p>No Skill added yet</p>
              <p className='text-sm text-neutral-500'>
                You need to add at least one skill to your profile for apply
                any job.
              </p>
            </div>
          </div>
        ) : (
          <div className='w-full flex gap-5'>
            {user?.skills?.map((item) => (
              <div className='flex flex-col' key={item.id}>
                <div className='flex'>
                  <div
                    className='flex text-white justify-center bg-[#295B81] dark:bg-[#1034ff] rounded-md p-2 gap-2 items-center'
                    onClick={() => onDelete(item)}
                  >
                    <div className='flex'>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>{item.name}</TooltipTrigger>
                            <TooltipContent>
                              <p>{item.experienceLevel}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {deletingId === item.id ? (
                      <Loader2 className='h-4 w-4 text-emerald-500 animate-spin' />
                    ) : (
                      <>
                        <div
                          className='p-1 cursor-pointer'
                          onClick={() => onDelete(item)}
                        >
                          <X className='h-4 w-4 text-neutral-100' />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
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
                    <FormLabel>Name of Skill</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'JavaScript'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='experienceLevel'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <FormControl>
                      <ComboBox
                        options={ExperienceLevels}
                        heading='Experience Level'
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
                disabled={!isValid || isLoading}
                typeof='submit'
              >
                <Loader2 className='h-5 w-5 text-primary animate-spin' />
              </Button>
              ) : (
                <Button
                  variant={"primary"}
                  disabled={!isValid || isLoading}
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

export default UserSkillss;

