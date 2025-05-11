
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ReminderSettings = () => {
  const [appointmentReminder, setAppointmentReminder] = useState(true);
  const [followUpReminder, setFollowUpReminder] = useState(true);
  const [paymentReminder, setPaymentReminder] = useState(true);
  const [medicationReminder, setMedicationReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("24");
  const [customMessage, setCustomMessage] = useState("");
  
  const handleSaveSettings = () => {
    // Placeholder for backend integration
    toast.success("Reminder settings saved successfully");
  };
  
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Reminder Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Appointment Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Send reminders for upcoming appointments
                </p>
              </div>
              <Switch
                checked={appointmentReminder}
                onCheckedChange={setAppointmentReminder}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Follow-up Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Send reminders for follow-up appointments
                </p>
              </div>
              <Switch
                checked={followUpReminder}
                onCheckedChange={setFollowUpReminder}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Send reminders for pending payments
                </p>
              </div>
              <Switch
                checked={paymentReminder}
                onCheckedChange={setPaymentReminder}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Medication Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Send medication adherence reminders
                </p>
              </div>
              <Switch
                checked={medicationReminder}
                onCheckedChange={setMedicationReminder}
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="reminder-time">Default Reminder Time</Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time before appointment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 hours before</SelectItem>
                <SelectItem value="12">12 hours before</SelectItem>
                <SelectItem value="6">6 hours before</SelectItem>
                <SelectItem value="2">2 hours before</SelectItem>
                <SelectItem value="1">1 hour before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message Template</Label>
            <Textarea
              id="custom-message"
              placeholder="Enter your custom reminder message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Use [NAME], [DATE], [TIME], [DOCTOR] as placeholders in your message.
            </p>
          </div>
          
          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;
