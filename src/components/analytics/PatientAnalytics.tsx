
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Mock data for patient analytics
const patientAgeData = [
  { name: "0-18", value: 15 },
  { name: "19-35", value: 30 },
  { name: "36-50", value: 25 },
  { name: "51-65", value: 20 },
  { name: "65+", value: 10 },
];

const patientGenderData = [
  { name: "Male", value: 45 },
  { name: "Female", value: 55 },
];

const appointmentTypeData = [
  { name: "Consultation", value: 50 },
  { name: "Follow-up", value: 35 },
  { name: "Emergency", value: 10 },
  { name: "Other", value: 5 },
];

const COLORS = ["#1A7FFF", "#4CD964", "#FFCC00", "#FF3B30", "#9B87F5"];

const PatientAnalytics = () => {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Patient Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h3 className="text-center font-medium">Age Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientAgeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {patientAgeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-center font-medium">Gender Distribution</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientGenderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {patientGenderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-center font-medium">Appointment Types</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {appointmentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold">1,258</p>
              <p className="text-xs text-success-700">
                ↑ 12% vs last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">New Patients</p>
              <p className="text-2xl font-bold">87</p>
              <p className="text-xs text-success-700">
                ↑ 5% vs last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Returning Patients</p>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-xs text-success-700">
                ↑ 3% vs last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
              <p className="text-2xl font-bold">12 min</p>
              <p className="text-xs text-error-500">
                ↓ 2 min vs last month
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAnalytics;
