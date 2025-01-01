"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { job_tags } from "@/scripts/aiprompts";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, UserProfile } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TagFormProps {
  initialData: Job | null;
  jobId: string | undefined;
  user: UserProfile | null;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

const TagForm = ({ initialData, jobId, user }: TagFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [jobTags, setJobTags] = useState<string[]>(
    Array.isArray(initialData?.tags)
      ? initialData?.tags
      : initialData?.tags
      ? initialData?.tags.split(",")
      : [] // Convert string to array
  );
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: jobTags },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/user/${user?.userId}/createNewJob/${jobId}`,
        values
      );
      toast.success("Short Description updated successfully!");
      toggleEiditing();
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
      toggleEiditing();
    }
  };

  const toggleEiditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);

      await getGenerativeAIResponse(job_tags(prompt)).then((data) => {
        if (Array.isArray(JSON.parse(data))) {
          setJobTags((prevTags) => [...prevTags, ...JSON.parse(data)]);
        }
        setIsPrompting(false);
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsPrompting(false);
    }
  };

  const handleTagRemove = (index: number) => () => {
    // setJobTags((tags) => tags.filter((_, i) => i !== index));
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
  };

  return (
    <Card className='mt-6 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Skills
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

      {/* Display the Short Description if not Editing */}
      {!isEditing && (
        <div className='flex items-center flex-wrap gap-2'>
          {jobTags.length > 0 ? (
            jobTags.map((tag, index) => (
              <div
                key={index}
                className='text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-[#0AAB7C]/10'
              >
                {tag}
              </div>
            ))
          ) : (
            <p className='text-neutral-500 italic'>No Tags</p>
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
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
            Note*: Profession Name alone enough to generate the tags
          </p>

          <div className='flex items-center gap-2 flex-wrap'>
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className='text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-[#0AAB7C]/10'
                >
                  {tag}{" "}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      className='p-0 h-auto'
                      onClick={handleTagRemove(index)}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>No Tags</p>
            )}
          </div>

          <div className='flex items-center gap-2 justify-end mt-4'>
            <Button
              type='button'
              variant={"outline"}
              className='border-[#0AAB7C] text-[#0AAB7C] hover:text-white hover:bg-[#0AAB7C]/80'
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
            >
              Clear All
            </Button>
            <Button
              type='submit'
              variant={"primary"}
              disabled={isSubmitting}
              onClick={() => onSubmit({ tags: jobTags })}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default TagForm;
