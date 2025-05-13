import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Home, FileText } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Patient, PatientFormData } from "@/services/patientService";
import DatePicker from "@/components/ui/DatePicker";

// Validation schema for the form
const patientSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters"),
  birth_date: z.date().optional(),
  gender: z.string().optional(),
  contact: z.string({ required_error: "Contact number is required" })
    .min(5, "Contact number must be at least 5 digits"),
  address: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  medical_history: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active")
});

type FormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormData) => void;
  isLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSubmit,
  isLoading = false
}) => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    patient?.birth_date ? new Date(patient.birth_date) : undefined
  );

  // Initialize form with default values or existing patient data
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name || "",
      birth_date: patient?.birth_date ? new Date(patient.birth_date) : undefined,
      gender: patient?.gender || "",
      contact: patient?.contact || "",
      address: patient?.address || "",
      email: patient?.email || "",
      medical_history: patient?.medical_history || "",
      status: patient?.status || "active"
    }
  });

  // Watch form values for updates
  const selectedGender = watch("gender");
  const selectedStatus = watch("status");

  // Update form values when birth date changes
  React.useEffect(() => {
    if (birthDate) {
      setValue("birth_date", birthDate);
    }
  }, [birthDate, setValue]);

  // Form submission handler
  const handleFormSubmit = (data: FormValues) => {
    // Format the data
    const formattedData: PatientFormData = {
      name: data.name,
      birth_date: data.birth_date ? format(data.birth_date, "yyyy-MM-dd") : undefined,
      gender: data.gender,
      contact: data.contact,
      address: data.address || undefined,
      email: data.email || undefined,
      medical_history: data.medical_history || undefined,
      status: data.status
    };

    // Call the onSubmit callback with the formatted data
    onSubmit(formattedData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {patient?.id ? "Edit Patient" : "Add New Patient"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter full name"
                  {...register("name")}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-error-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="contact"
                  placeholder="Enter contact number"
                  {...register("contact")}
                  disabled={isLoading}
                />
              </div>
              {errors.contact && (
                <p className="text-xs text-error-500 mt-1">{errors.contact.message}</p>
              )}
            </div>

            {/* Birth Date - Using our new DatePicker */}
            <div className="space-y-2">
              <DatePicker
                label="Date of Birth"
                value={birthDate}
                onChange={setBirthDate}
                disabled={isLoading}
                placeholder="Select date of birth"
                maxDate={new Date()} // Can't be born in the future
                error={errors.birth_date?.message}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={selectedGender}
                onValueChange={(value) => setValue("gender", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...register("email")}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Status (only for editing) */}
            {patient?.id && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => 
                    setValue("status", value as "active" | "inactive")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="Enter address"
                {...register("address")}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-2">
            <Label htmlFor="medical_history">Medical History</Label>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-2" />
              <Textarea
                id="medical_history"
                placeholder="Enter medical history, conditions, allergies, etc."
                className="min-h-[120px]"
                {...register("medical_history")}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading 
              ? "Saving..." 
              : patient?.id 
                ? "Update Patient" 
                : "Add Patient"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PatientForm;