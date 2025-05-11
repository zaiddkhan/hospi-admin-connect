
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Mock data for appointments
const appointmentData = [
  { day: "Mon", appointments: 6 },
  { day: "Tue", appointments: 8 },
  { day: "Wed", appointments: 12 },
  { day: "Thu", appointments: 7 },
  { day: "Fri", appointments: 10 },
  { day: "Sat", appointments: 15 },
  { day: "Sun", appointments: 4 },
];

const AppointmentsOverview = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Appointments Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={appointmentData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A7FFF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1A7FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#1A7FFF"
                fillOpacity={1}
                fill="url(#colorAppointments)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsOverview;
