
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MessageCircle, Send, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const WhatsappInterface = () => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("appointment");
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: "user" | "patient";
    timestamp: string;
  }>>([
    {
      id: 1,
      text: "Hello! How can I schedule an appointment?",
      sender: "patient",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      text: "Hi! We have slots available tomorrow at 10:00 AM and 2:30 PM. Would any of these work for you?",
      sender: "user",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      text: "10:00 AM would be perfect, thank you!",
      sender: "patient",
      timestamp: "10:33 AM",
    }
  ]);

  const handleSend = () => {
    if (!recipient || !message) {
      toast.error("Please enter recipient and message");
      return;
    }

    // Add message to the conversation
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    // Placeholder for backend integration
    toast.success("Message sent successfully");
    
    // Simulate response after a delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Thank you for your message. I'll see you at the scheduled time.",
          sender: "patient",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }, 1500);
    
    // Clear message input
    setMessage("");
  };

  const handleTemplateSelect = (type: string) => {
    setMessageType(type);
    
    let templateMessage = "";
    
    switch (type) {
      case "appointment":
        templateMessage = "Your appointment is scheduled for [DATE] at [TIME]. Please confirm by replying YES.";
        break;
      case "reminder":
        templateMessage = "This is a reminder for your appointment tomorrow at [TIME]. Please reply with YES to confirm or NO to reschedule.";
        break;
      case "follow-up":
        templateMessage = "Hope you're feeling better! Please let us know if you'd like to schedule a follow-up appointment.";
        break;
      case "payment":
        templateMessage = "Your invoice for ₹[AMOUNT] is ready. Please click the link below to complete the payment: [PAYMENT_LINK]";
        break;
      default:
        templateMessage = "";
    }
    
    setMessage(templateMessage);
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>WhatsApp Communication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Recipient's phone number"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Select value={messageType} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select message template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Appointment Confirmation</SelectItem>
                  <SelectItem value="reminder">Appointment Reminder</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="payment">Payment Request</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                className="min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <Button onClick={handleSend} className="w-full">
              <Send className="h-4 w-4 mr-2" /> Send Message
            </Button>
          </div>
          
          <div className="flex-1 border rounded-md p-4 h-[300px] md:h-auto overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      AP
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Arjun Patel</p>
                    <p className="text-xs text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsappInterface;
