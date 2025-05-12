import React, { useState, useMemo } from "react";
import { Patient } from "@/services/patientService";
import { Search, Download, Upload, Plus, Edit, Trash2, FileText, Calendar, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { format, isValid, differenceInYears } from "date-fns";
import { toast } from "sonner";

interface PatientListProps {
  patients: Patient[];
  isLoading: boolean;
  error: any;
  onDelete?: (id: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  isLoading,
  error,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Calculate patient age
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "-";
    try {
      const date = new Date(birthDate);
      if (!isValid(date)) return "-";
      return differenceInYears(new Date(), date);
    } catch (error) {
      return "-";
    }
  };

  // Filter patients based on search query and filters - memoized for performance
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        !searchQuery ||
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.contact.includes(searchQuery) ||
        (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = !statusFilter || statusFilter === "all" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  // Navigate to patient detail page
  const navigateToPatient = (id: string) => {
    navigate(`/patients/${id}`);
  };

  // Handle export function
  const handleExport = () => {
    toast.info("Exporting patient data...");
    // Implementation would go here
  };

  // Handle import function
  const handleImport = () => {
    toast.info("Import feature coming soon");
    // Implementation would go here
  };

  // Handle patient deletion with confirmation
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  // Navigate to schedule appointment for specific patient
  const handleScheduleAppointment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering row click
    navigate(`/appointments/new?patient_id=${id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-error-500">
              Failed to load patients. Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patients List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row flex-wrap gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleImport}>
              <Upload className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={() => navigate("/patients/new")}>
              <Plus className="h-4 w-4 mr-2" /> Add Patient
            </Button>
          </div>

          {/* Patients table */}
          {filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-2">No patients found</p>
              <Button
                onClick={() => navigate("/patients/new")}
                variant="outline"
                size="sm"
              >
                Add New Patient
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
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
                    <TableRow 
                      key={patient.id}
                      className="cursor-pointer"
                      onClick={() => navigateToPatient(patient.id)}
                    >
                      <TableCell className="font-medium">
                        {patient.name}
                      </TableCell>
                      <TableCell>
                        {patient.age || calculateAge(patient.birth_date)}
                      </TableCell>
                      <TableCell>{patient.gender || "-"}</TableCell>
                      <TableCell>{patient.contact}</TableCell>
                      <TableCell>
                        {patient.last_visit 
                          ? format(new Date(patient.last_visit), "MMM d, yyyy") 
                          : "-"}
                      </TableCell>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigateToPatient(patient.id);
                            }}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleScheduleAppointment(patient.id, e)}>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/patients/${patient.id}?edit=true`);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-error-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(patient.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientList;