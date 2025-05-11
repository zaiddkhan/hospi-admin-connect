
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const InvoiceGenerator = () => {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState([
    { id: 1, description: "Consultation", quantity: 1, rate: 500 }
  ]);
  
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { id: newId, description: "", quantity: 1, rate: 0 }]);
  };
  
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };
  
  const calculateGST = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };
  
  const handleGenerateInvoice = () => {
    if (!patientName || !patientPhone || !invoiceDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (items.some(item => !item.description)) {
      toast.error("Please fill in all item descriptions");
      return;
    }
    
    // Placeholder for backend integration
    toast.success("Invoice generated successfully");
    
    // Generate invoice PDF or send via WhatsApp integration would happen here
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Generate Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Patient Name</Label>
              <Input
                id="patient-name"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patient-phone">Phone Number</Label>
              <Input
                id="patient-phone"
                placeholder="Enter phone number"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Input
                id="invoice-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select defaultValue="upi">
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Invoice Items</h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label htmlFor={`item-${item.id}-desc`}>Description</Label>
                    <Input
                      id={`item-${item.id}-desc`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor={`item-${item.id}-qty`}>Qty</Label>
                    <Input
                      id={`item-${item.id}-qty`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Label htmlFor={`item-${item.id}-rate`}>Rate (₹)</Label>
                    <Input
                      id={`item-${item.id}-rate`}
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-end">
                    <p className="text-sm font-medium">
                      ₹{(item.quantity * item.rate).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (18%):</span>
              <span>₹{calculateGST().toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Button onClick={handleGenerateInvoice} className="w-full">
              Generate Invoice & Send
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Invoice will be sent to patient via WhatsApp
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator;
