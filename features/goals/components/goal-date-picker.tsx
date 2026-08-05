"use client";

import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface GoalDatePickerProps {
  id: string;
  value: string | null;
  placeholder: string;
  onChange: (value: string | null) => void;
  minimumDate?: Date;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
}

function parseDate(value: string | null) {
  if (!value) return undefined;

  const date = parseISO(value);
  return isValid(date) ? date : undefined;
}

export function GoalDatePicker({
  id,
  value,
  placeholder,
  onChange,
  minimumDate,
  required = false,
  invalid = false,
  clearable = false,
}: GoalDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDate(value);

  function selectDate(date: Date | undefined) {
    if (!date) {
      if (clearable) onChange(null);
      return;
    }

    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  }

  function clearDate() {
    onChange(null);
    setOpen(false);
  }

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-expanded={open}
          aria-invalid={invalid}
          aria-required={required}
          data-empty={!selectedDate}
          className={cn(
            "w-full justify-between font-normal",
            !selectedDate && "text-muted-foreground",
          )}
        >
          <span>
            {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
          </span>
          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto gap-0 p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate ?? minimumDate}
          disabled={minimumDate ? { before: minimumDate } : undefined}
          onSelect={selectDate}
          autoFocus
        />
        {clearable && selectedDate && (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={clearDate}
            >
              Clear deadline
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
