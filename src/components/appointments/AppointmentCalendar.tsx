
import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AppointmentCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
            Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border p-4 pointer-events-auto"
        />
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;
