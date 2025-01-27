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
import { Switch } from "@/components/ui/switch";
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
// import { Calendar } from "@/components/ui/calendar";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
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
import Editor from "./Editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface Field<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type:
    | "input"
    | "number"
    | "textarea"
    | "richtextarea"
    | "select"
    | "datetime"
    | "date"
    | "switchButton"
    | "checkbox"
    | "time"
    | "file";
  comboboxOptions?: { label: string; value: string }[];
  heading?: string;
  disabled?: boolean;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AccordionContentItem<T extends FieldValues> {
  title: string;
  content: React.ReactNode;
  fields?: Field<T>[];
}

interface ButtonConfig {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "destructive";
  isLoading?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface DialogFormProps<T extends FieldValues> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: Field<T>[];
  buttons: ButtonConfig[];
  onSubmit: (data: T) => void;
  isSteps?: boolean;
  form: UseFormReturn<T>; // Pass the form instance
  isSubmitting?: boolean; // For form loading state
  accordionContent?: AccordionContentItem<T>[];
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
  isSteps,
  isSubmitting,
  accordionContent,
}: DialogFormProps<T>) => {
  const renderField = (field: Field<T>) => {
    const innerField = form.register(field.name);

    switch (field.type) {
      case "checkbox":
        return (
          <div className='flex items-center space-x-2'>
            <Checkbox
              id={field.name}
              {...innerField}
              onCheckedChange={(checked) => {
                form.setValue(field.name, checked);
              }}
            />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        );
      case "input":
        return (
          <Input
            {...innerField}
            placeholder={field.placeholder}
            disabled={field.disabled || isSubmitting}
          />
        );
      // Add cases for other field types as needed
      default:
        return null;
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-auto'>
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
                      {field.label && field.type !== "checkbox" && (
                        <FormLabel>{field.label}</FormLabel>
                      )}
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
                                  disabled={field.disabled || isSubmitting}
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
                                {/* <Calendar
                                  mode='single'
                                  selected={innerField.value}
                                  onSelect={innerField.onChange}
                                  disabled={(date: Date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today;
                                  }}
                                  autoFocus
                                /> */}
                                <div className='p-4'>
                                  <DayPicker
                                    mode='single'
                                    captionLayout='dropdown'
                                    selected={innerField.value}
                                    onSelect={innerField.onChange}
                                    disabled={(date: Date) => {
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return date < today;
                                    }}
                                    autoFocus
                                  />
                                </div>
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
                        {field.type === "number" && (
                          <FormControl>
                            <Input
                              type='number'
                              {...innerField}
                              placeholder={field.placeholder}
                              disabled={field.disabled || isSubmitting}
                            />
                          </FormControl>
                        )}
                        {field.type === "file" && (
                          <FormControl>
                            <Input
                              type='file'
                              accept={field.accept}
                              onChange={(e) => {
                                innerField.onChange(e.target.files);
                                field.onChange?.(e); // Call custom onChange if provided
                              }}
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
                        {field.type === "richtextarea" && (
                          <FormControl>
                            <Editor
                              value={innerField.value}
                              onChange={(content) =>
                                innerField.onChange(content)
                              }
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
                        {field.type === "switchButton" && (
                          <FormControl>
                            <div className='flex items-center space-x-2'>
                              <Switch
                                checked={innerField.value}
                                onCheckedChange={innerField.onChange}
                                disabled={field.disabled || isSubmitting}
                              />
                              <span>
                                {innerField.value ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </FormControl>
                        )}
                        {field.type === "checkbox" && (
                          <div className='flex items-center space-x-2'>
                            <Checkbox
                              checked={innerField.value}
                              onCheckedChange={innerField.onChange}
                              disabled={field.disabled || isSubmitting}
                            />
                            <Label>{field.label}</Label>
                          </div>
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
                        {field.type === "time" && (
                          <FormControl>
                            <Input
                              type='time'
                              disabled={field.disabled || isSubmitting}
                              placeholder={field.placeholder}
                            />
                          </FormControl>
                        )}
                      </>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              {isSteps && accordionContent && (
                <div className='text-muted-foreground'>
                  <Accordion type='single' collapsible className='w-full'>
                    {accordionContent.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index + 1}`}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent>
                          {item.content} {/* Directly render the JSX */}
                          {item.fields &&
                            item.fields.map((field) => (
                              <FormField
                                key={field.name as string}
                                control={form.control}
                                name={field.name}
                                render={({ field: innerField }) => (
                                  <FormItem className='mt-5'>
                                    {field.label &&
                                      field.type !== "checkbox" && (
                                        <FormLabel>{field.label}</FormLabel>
                                      )}
                                    <FormControl>
                                      {renderField(field)}
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
            <div className='flex w-full'>
              <DialogFooter className='w-full flex gap-3'>
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant || "secondary"}
                    onClick={button.onClick}
                    type={button.type || "button"}
                    disabled={isSubmitting || button.disabled}
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
