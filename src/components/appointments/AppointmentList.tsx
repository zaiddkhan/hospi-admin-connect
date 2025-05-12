import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Search, Filter, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import { Appointment } from "@/services/appointmentService";
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
import { useConfirmAppointment, useCancelAppointment, useDeleteAppointment } from "@/hooks/useAppointments";
import { useNavigate } from "react-router-dom";

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  error: any;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (id: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  isLoading,
  error,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  
  const confirmAppointment = useConfirmAppointment();
  const cancelAppointment = useCancelAppointment();
  const deleteAppointment = useDeleteAppointment();

  // Handle appointment confirmation
  const handleConfirm = (id: string) => {
    confirmAppointment.mutate(id);
  };

  // Handle appointment cancellation
  const handleCancel = (id: string) => {
    cancelAppointment.mutate(id);
  };

  // Handle appointment deletion
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      if (onDelete) {
        onDelete(id);
      } else {
        deleteAppointment.mutate(id);
      }
    }
  };

  // Filter appointments based on search query and filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      !searchQuery ||
      (appointment.patients?.name &&
        appointment.patients.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (appointment.type &&
        appointment.type.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesType = !typeFilter || appointment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success-500">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-error-500">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-primary">Completed</Badge>;
      default:
        return <Badge className="bg-warning-500">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <p className="text-error-500">
              Failed to load appointments. Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All-status">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All_sypes">All Types</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="check-up">Check-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointments table */}
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-2">No appointments found</p>
              <Button
                onClick={() => navigate("/appointments/new")}
                variant="outline"
                size="sm"
              >
                Schedule New Appointment
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Date
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Time
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.patients?.name || "Unknown Patient"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(appointment.date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(`2000-01-01T${appointment.time}`),
                          "hh:mm a"
                        )}
                      </TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Filter className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {appointment.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleConfirm(appointment.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm
                              </DropdownMenuItem>
                            )}
                            
                            {(appointment.status === "pending" || appointment.status === "confirmed") && (
                              <DropdownMenuItem onClick={() => handleCancel(appointment.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => onEdit && onEdit(appointment)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="text-error-500"
                              onClick={() => handleDelete(appointment.id)}
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

export default AppointmentList;