"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  selected: Date | null
  onSelect: (date: Date | null) => void
  placeholderText: string
}

export function DatePicker({ selected, onSelect, placeholderText }: DatePickerProps) {
  const handleSelect = (date: Date | undefined) => {
    // Convert undefined to null to match the expected type of `onSelect`
    onSelect(date || null)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholderText}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected || undefined}
          onSelect={handleSelect} // Use the adapted handler
          autoFocus
          required={false}
        />
      </PopoverContent>
    </Popover>
  )
}