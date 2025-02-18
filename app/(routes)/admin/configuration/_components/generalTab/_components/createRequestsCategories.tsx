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
import { RequestCategorySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestCategory, Requests, Skills, UserProfile } from "@prisma/client";
import axios from "axios";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GeneralTabCreateRequestsCategoryProps {
  user: (UserProfile & { skills: Skills[] }) | null;
  category: (RequestCategory & { requests: Requests[] })[];
}

const CreateRequestsCategory = ({
  user,
  category,
}: GeneralTabCreateRequestsCategoryProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCateogryId, setEditingCateogryId] = useState<string | null>(
    null
  );
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof RequestCategorySchema>>({
    resolver: zodResolver(RequestCategorySchema),
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    if (editingCateogryId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCateogryId]);

  const onSubmit = async (values: z.infer<typeof RequestCategorySchema>) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/${user?.userId}/categories`, {
        name: values.name,
      });
      setIsAdding(false);
      router.refresh();
      toast.success(`New Category added.`);
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

  const updateCategories = async (categoryId: string, newName: string) => {
    try {
      await axios.patch(`/api/user/${user?.userId}/categories/${categoryId}`, {
        name: newName,
      });
      setEditingCateogryId(null);
      router.refresh();
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category. Please try again.");
    }
  };

  const onDelete = async (category: RequestCategory) => {
    try {
      setDeletingId(category.id);
      await axios.delete(`/api/user/${user?.userId}/categories/${category.id}`);
      router.refresh();
      toast.success(
        `${category.name} category has been deleted successfully from your organization.`
      );
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

  const handleEditStart = (category: RequestCategory) => {
    setEditingCateogryId(category.id);
    setEditingName(category.name);
  };

  const handleEditEnd = (categoryId: string) => {
    if (editingName.trim() !== "") {
      updateCategories(categoryId, editingName);
    }
    setEditingCateogryId(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    categoryId: string
  ) => {
    if (e.key === "Enter") {
      handleEditEnd(categoryId);
    }
  };

  return (
    <Card className='w-full flex flex-col items-center justify-center gap-10 px-10 py-10 pt-13 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-xl mt-5 mb-5'>
      <div className='flex justify-between w-full'>
        <h2 className='text-xl font-medium text-muted-foreground self-start'>
          Categories
          <span className='text-red-500 ml-1'>*</span>
        </h2>
        <Button onClick={() => setIsAdding(!isAdding)} variant={"primary"}>
          {isAdding ? (
            <div className=''>Cancel</div>
          ) : (
            <div className='text-white dark:text-white hover:font-semibold flex items-center'>
              <Plus className='w-4 text-white dark:text-white hover:font-semibold h-4 mr-2' />
              Add
            </div>
          )}
        </Button>
      </div>
      {!isAdding ? (
        category?.length === 0 ? (
          <div className='flex justify-center items-center'>
            <div className='text-neutral-400 flex justify-center items-center flex-col'>
              <p>No category added yet</p>
              <p className='text-sm text-neutral-500'>
                You need to add categories for employe requests.
              </p>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
            {category?.map((item) => (
              <Card key={item.id} className='p-4 flex flex-col'>
                <div className='flex justify-between items-center mb-2'>
                  {editingCateogryId === item.id ? (
                    <Input
                      ref={inputRef}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleEditEnd(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      className='text-lg font-semibold'
                    />
                  ) : (
                    <h3
                      className='text-lg font-semibold cursor-pointer'
                      onClick={() => handleEditStart(item)}
                    >
                      {item.name}
                    </h3>
                  )}
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(item)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <X className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                <div className='text-2xl font-bold mb-2'>
                  {item.requests.length}
                </div>
                <div className='text-sm text-muted-foreground'>Total Requests for this Category</div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Form {...form}>
          <form
            className='space-y-8 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid md:grid-cols-2 grid-cols-1 gap-10 w-full'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Category</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g 'Stationary'"
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
                  type='submit'
                >
                  <Loader2 className='h-5 w-5 text-primary animate-spin' />
                </Button>
              ) : (
                <Button
                  variant={"primary"}
                  disabled={!isValid || isSubmitting}
                  type='submit'
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

export default CreateRequestsCategory;
