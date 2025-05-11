
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const handleSaveChanges = () => {
    toast.success("Settings saved successfully");
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="text-muted-foreground">Manage your practice settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Practice Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integration">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic settings for your practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="practice-name">Practice Name</Label>
                    <Input id="practice-name" defaultValue="Dr. Rajeev's Clinic" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Health Street, Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 22 1234 5678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="contact@drrajeev.com" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appointment Confirmations</p>
                      <p className="text-sm text-muted-foreground">
                        Require patients to confirm appointments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Waitlist System</p>
                      <p className="text-sm text-muted-foreground">
                        Enable waitlist for cancelled appointments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">WhatsApp Communication</p>
                      <p className="text-sm text-muted-foreground">
                        Use WhatsApp as primary communication channel
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Practice Profile</CardTitle>
                <CardDescription>
                  Customize how your practice appears to patients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="practice-description">Practice Description</Label>
                    <Input 
                      id="practice-description" 
                      defaultValue="Multi-specialty clinic providing comprehensive care for all your health needs."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input 
                      id="specialties" 
                      defaultValue="General Medicine, Cardiology, Pediatrics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://drrajeev.com" />
                  </div>
                </div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Summary</p>
                      <p className="text-sm text-muted-foreground">
                        Receive daily summary reports
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Appointments</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new appointment bookings
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Inventory Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about low stock items
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about payments received
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Connect with other systems and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Clinical Scribe Agent</p>
                      <p className="text-sm text-muted-foreground">
                        Connect with HospiAgent's Clinical Scribe
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">WhatsApp Business API</p>
                      <p className="text-sm text-muted-foreground">
                        Connect your WhatsApp Business account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Gateways</p>
                      <p className="text-sm text-muted-foreground">
                        Configure payment processing services
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">EMR Integration</p>
                      <p className="text-sm text-muted-foreground">
                        Connect with your Electronic Medical Records
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
