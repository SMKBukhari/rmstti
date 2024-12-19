"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import ComboBox from "@/components/ui/combo-box";
import { CalendarIcon, Loader2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimePicker12 } from "@/components/TimePicker12Hours";

interface Field<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type: "input" | "textarea" | "select" | "datetime" | "date";
  comboboxOptions?: { label: string; value: string }[];
  heading?: string;
  disabled?: boolean;
}

interface ButtonConfig {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "destructive";
  isLoading?: boolean;
  type?: "button" | "submit";
}

interface DialogFormProps<T extends FieldValues> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: Field<T>[];
  buttons: ButtonConfig[];
  onSubmit: (data: T) => void;
  form: UseFormReturn<T>; // Pass the form instance
  isSubmitting?: boolean; // For form loading state
}

const DialogForm = <T extends FieldValues>({
  isOpen,
  onOpenChange,
  title,
  description,
  fields,
  buttons,
  onSubmit,
  form,
  isSubmitting,
}: DialogFormProps<T>) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-8 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid grid-cols-1 gap-10 w-full'>
              {fields.map((field) => (
                <FormField
                  key={field.name as string}
                  control={form.control}
                  name={field.name}
                  render={({ field: innerField }) => (
                    <FormItem>
                      {field.label && <FormLabel>{field.label}</FormLabel>}
                      <>
                        {/* Handling different field types separately */}
                        {field.type === "datetime" && (
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[340px] pl-3 text-left font-normal",
                                    !innerField.value && "text-muted-foreground"
                                  )}
                                >
                                  {innerField.value ? (
                                    format(innerField.value, "PPP hh:mm:ss a")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={innerField.value}
                                  onSelect={innerField.onChange}
                                  disabled={(date: Date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today;
                                  }}
                                  initialFocus
                                />
                                <div className='p-3 border-t border-border'>
                                  <TimePicker12
                                    setDate={innerField.onChange}
                                    date={innerField.value}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        )}
                        {field.type === "input" && (
                          <FormControl>
                            <Input
                              {...innerField}
                              placeholder={field.placeholder}
                              disabled={field.disabled || isSubmitting}
                            />
                          </FormControl>
                        )}
                        {field.type === "textarea" && (
                          <FormControl>
                            <Textarea
                              {...innerField}
                              placeholder={field.placeholder}
                              className='min-h-[200px]'
                              disabled={field.disabled || isSubmitting}
                            />
                          </FormControl>
                        )}
                        {field.type === "select" && field.comboboxOptions && (
                          <FormControl>
                            <ComboBox
                              options={field.comboboxOptions}
                              value={innerField.value}
                              onChange={innerField.onChange}
                              heading={field.heading || "Select an Option"}
                            />
                          </FormControl>
                        )}
                        {field.type === "date" && (
                          <FormControl>
                            <Input
                              type='date'
                              disabled={field.disabled || isSubmitting}
                              placeholder={field.placeholder}
                              value={
                                innerField.value
                                  ? new Date(innerField.value)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                innerField.onChange(new Date(e.target.value))
                              }
                              onBlur={innerField.onBlur}
                              ref={innerField.ref}
                            />
                          </FormControl>
                        )}
                      </>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className='flex w-full'>
              <DialogFooter>
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant || "secondary"}
                    onClick={button.onClick}
                    type={button.type || "button"}
                    disabled={isSubmitting}
                  >
                    {button.isLoading ? (
                      <Loader2 className='w-3 h-3 animate-spin' />
                    ) : (
                      button.label
                    )}
                  </Button>
                ))}
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
