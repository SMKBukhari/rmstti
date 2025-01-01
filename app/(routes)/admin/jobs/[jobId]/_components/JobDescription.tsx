"use client";

import Editor from "@/components/Editor";
import Preview from "@/components/PreviewEditorText";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { job_description } from "@/scripts/aiprompts";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, UserProfile } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface JobDescriptionProps {
  initialData: Job | null;
  jobId: string | undefined;
  user: UserProfile | null;
}

const formSchema = z.object({
  description: z.string().min(1),
});

const JobDescription = ({ initialData, jobId, user }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollName, setRollName] = useState("");
  const [skills, setSkills] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/user/${user?.userId}/createNewJob/${jobId}`,
        values
      );
      router.refresh();
      setIsEditing(false);
      toast.success("Job Description updated successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsEditing(false);
    }
  };

  const toggleEiditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);

      await getGenerativeAIResponse(job_description(rollName, skills)).then(
        (data) => {
          data = data.replace(/^'|'$/g, "");
          const cleanedText = data.replace(/[\*\#]/g, "");
          setAiValue(cleanedText);
          setIsPrompting(false);
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(`Failed to generate the prompt...: ${error}`);
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card className='mt-6 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Job Description
        <Button onClick={toggleEiditing} variant={"ghost"}>
          {isEditing ? (
            <div className='text-neutral-500'>Cancel</div>
          ) : (
            <div className='text-[#295B81] dark:text-[#1034ff] flex items-center'>
              <Pencil className='w-4 dark:text-[#1034ff] text-[#295B81] h-4 mr-2' />
              Edit
            </div>
          )}
        </Button>
      </div>

      {/* Display the Description if not Editing */}
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData?.description && "text-neutral-500 italic"
          )}
        >
          {!initialData?.description && "No Description Provided"}
          {initialData?.description && (
            <Preview value={initialData?.description} />
          )}
        </div>
      )}

      {/* Display the Form if Editing */}
      {isEditing && (
        <>
          <div className='flex items-center gap-2 my-2'>
            <input
              type='text'
              placeholder="e.g 'Full-Stack Developer'"
              className='w-full p-2 rounded-md'
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Required Skills sets'
              className='w-full p-2 rounded-md'
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            {isPrompting ? (
              <>
                <Button variant={"primary"}>
                  <Loader2 className='w-4 h-4 animate-spin' />
                </Button>
              </>
            ) : (
              <>
                <Button variant={"primary"} onClick={handlePromptGeneration}>
                  <Lightbulb className='w-4 h-4' />
                </Button>
              </>
            )}
          </div>
          <p className='text-xs text-muted-foreground text-right'>
            Note*: Profession Name & Required Skills desired by comma
          </p>

          {aiValue && (
            <div className='w-full h-96 max-h-96 rounded-md bg-background overflow-y-scroll p-3 relative mt-4'>
              {aiValue}

              <Button
                className='absolute top-3 right-3 z-10'
                variant={"outline"}
                size={"icon"}
                onClick={onCopy}
              >
                <Copy className='w-full h-full text-[#0AAB7C]' />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 mt-4'
            >
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        value={field.value}
                        onChange={(content) => field.onChange(content)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-x-2'>
                <Button
                  variant={"primary"}
                  disabled={!isValid || isSubmitting}
                  typeof='submit'
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </Card>
  );
};

export default JobDescription;
