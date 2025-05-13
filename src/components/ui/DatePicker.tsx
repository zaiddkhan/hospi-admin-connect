import React, { useState } from "react";
import { format, addDays, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  yearRange?: { start: number; end: number };
  showStepToggle?: boolean;
  defaultStepMode?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  allowFutureDates?: boolean;
}

const DatePicker = ({
  value,
  onChange,
  label,
  disabled = false,
  placeholder = "Select date",
  minDate,
  maxDate,
  yearRange,
  showStepToggle = true,
  defaultStepMode = true,
  className,
  required = false,
  error,
  allowFutureDates = false,
}: DatePickerProps) => {
  const [useStepMode, setUseStepMode] = useState(defaultStepMode);
  const [selectedYear, setSelectedYear] = useState<string>(
    value ? value.getFullYear().toString() : ""
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    value ? value.getMonth().toString() : ""
  );
  const [selectedDay, setSelectedDay] = useState<string>(
    value ? value.getDate().toString() : ""
  );

  // Calculate year range
  const currentYear = new Date().getFullYear();
  const startYear = yearRange?.start || currentYear - 100;
  const endYear = yearRange?.end || (allowFutureDates ? currentYear + 10 : currentYear);
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  );

  // Months array
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  // Calculate days in month
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return [];
    
    const daysInMonth = new Date(
      parseInt(year),
      parseInt(month) + 1,
      0
    ).getDate();
    
    return Array.from(
      { length: daysInMonth },
      (_, i) => (i + 1).toString()
    );
  };

  const days = selectedYear && selectedMonth 
    ? getDaysInMonth(selectedYear, selectedMonth) 
    : [];

  // Update date when year, month or day changes
  const updateDate = (
    year?: string,
    month?: string,
    day?: string
  ) => {
    const y = year || selectedYear;
    const m = month || selectedMonth;
    const d = day || selectedDay;

    if (y && m && d) {
      const newDate = new Date(parseInt(y), parseInt(m), parseInt(d));
      
      if (isValid(newDate)) {
        // Check if date is within allowed range
        if (
          (!minDate || newDate >= minDate) &&
          (!maxDate || newDate <= maxDate)
        ) {
          onChange(newDate);
        }
      }
    }
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // If month and day are already selected, update the date
    updateDate(year);
    
    // If the selected day is not valid for this month/year, reset it
    if (selectedMonth && selectedDay) {
      const daysInNewMonth = getDaysInMonth(year, selectedMonth);
      if (parseInt(selectedDay) > daysInNewMonth.length) {
        setSelectedDay("");
      }
    }
  };

  // Handle month change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // If year and day are already selected, update the date
    updateDate(undefined, month);
    
    // If the selected day is not valid for this month/year, reset it
    if (selectedYear && selectedDay) {
      const daysInNewMonth = getDaysInMonth(selectedYear, month);
      if (parseInt(selectedDay) > daysInNewMonth.length) {
        setSelectedDay("");
      }
    }
  };

  // Handle day change
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    // If year and month are already selected, update the date
    updateDate(undefined, undefined, day);
  };

  // Handle calendar selection
  const handleCalendarSelect = (date: Date | undefined) => {
    onChange(date);
    
    if (date) {
      setSelectedYear(date.getFullYear().toString());
      setSelectedMonth(date.getMonth().toString());
      setSelectedDay(date.getDate().toString());
    }
  };

  // Check if a date should be disabled in the calendar
  const disabledCalendarDate = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (!allowFutureDates && date > new Date()) return true;
    return false;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <Label>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {showStepToggle && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="date-step-mode" className="text-xs">
              Step Mode
            </Label>
            <Switch
              id="date-step-mode"
              checked={useStepMode}
              onCheckedChange={setUseStepMode}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {useStepMode ? (
        <div className="grid grid-cols-3 gap-2">
          {/* Year Selection */}
          <Select
            value={selectedYear}
            onValueChange={handleYearChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Selection */}
          <Select
            value={selectedMonth}
            onValueChange={handleMonthChange}
            disabled={disabled || !selectedYear}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Day Selection */}
          <Select
            value={selectedDay}
            onValueChange={handleDayChange}
            disabled={disabled || !selectedYear || !selectedMonth}
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleCalendarSelect}
              initialFocus
              disabled={disabledCalendarDate}
            />
          </PopoverContent>
        </Popover>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default DatePicker;