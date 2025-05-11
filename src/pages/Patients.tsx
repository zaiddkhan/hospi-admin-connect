
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Upload } from "lucide-react";
import { toast } from "sonner";

// Mock data for patients
const patientsData = [
  {
    id: 1,
    name: "Arjun Patel",
    age: 35,
    gender: "Male",
    contact: "+91 98765 43210",
    lastVisit: "2025-05-10",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Singh",
    age: 28,
    gender: "Female",
    contact: "+91 91234 56789",
    lastVisit: "2025-05-09",
    status: "active",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    contact: "+91 87654 32109",
    lastVisit: "2025-05-05",
    status: "inactive",
  },
  {
    id: 4,
    name: "Aisha Verma",
    age: 32,
    gender: "Female",
    contact: "+91 76543 21098",
    lastVisit: "2025-05-08",
    status: "active",
  },
  {
    id: 5,
    name: "Vikram Mehta",
    age: 50,
    gender: "Male",
    contact: "+91 65432 10987",
    lastVisit: "2025-05-02",
    status: "active",
  },
  {
    id: 6,
    name: "Sneha Kapoor",
    age: 27,
    gender: "Female",
    contact: "+91 54321 09876",
    lastVisit: "2025-04-28",
    status: "inactive",
  },
];

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPatients = patientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.contact.includes(searchQuery)
  );
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Patients</h1>
            <p className="text-muted-foreground">Manage your patient information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" /> Import
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Patient
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center py-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.name}
                      </TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.contact}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            patient.status === "active"
                              ? "bg-success-500"
                              : "bg-muted"
                          }
                        >
                          {patient.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`View ${patient.name}'s profile`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Book appointment for ${patient.name}`)}
                        >
                          Book
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Patients;
