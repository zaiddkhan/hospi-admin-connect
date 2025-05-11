
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Mock data for payments
const payments = [
  {
    id: 1,
    patient: "Arjun Patel",
    date: "2025-05-10",
    amount: 1500,
    status: "paid",
    method: "UPI",
  },
  {
    id: 2,
    patient: "Priya Singh",
    date: "2025-05-09",
    amount: 2500,
    status: "pending",
    method: "Card",
  },
  {
    id: 3,
    patient: "Rajesh Kumar",
    date: "2025-05-08",
    amount: 3500,
    status: "paid",
    method: "Net Banking",
  },
  {
    id: 4,
    patient: "Aisha Verma",
    date: "2025-05-07",
    amount: 1800,
    status: "pending",
    method: "UPI",
  },
  {
    id: 5,
    patient: "Vikram Mehta",
    date: "2025-05-06",
    amount: 2200,
    status: "paid",
    method: "Cash",
  },
];

const PaymentTracker = () => {
  const sendReminder = (id: number) => {
    // Placeholder for backend integration
    toast.success("Payment reminder sent successfully");
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Tracker</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.patient}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      payment.status === "paid"
                        ? "bg-success-500"
                        : "bg-warning-500"
                    }
                  >
                    {payment.status === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {payment.status === "pending" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendReminder(payment.id)}
                    >
                      Send Reminder
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentTracker;
