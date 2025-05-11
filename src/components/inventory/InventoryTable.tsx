
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Mock data for inventory
const inventoryItems = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Medication",
    stock: 150,
    threshold: 50,
    status: "in-stock",
    unitPrice: 2.5,
    expiryDate: "2026-05-10",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Medication",
    stock: 80,
    threshold: 30,
    status: "in-stock",
    unitPrice: 4.8,
    expiryDate: "2025-12-15",
  },
  {
    id: 3,
    name: "Disposable Masks",
    category: "Supplies",
    stock: 25,
    threshold: 50,
    status: "low-stock",
    unitPrice: 10,
    expiryDate: "2027-01-01",
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    category: "Medication",
    stock: 5,
    threshold: 30,
    status: "critical",
    unitPrice: 3.2,
    expiryDate: "2026-08-20",
  },
  {
    id: 5,
    name: "Surgical Gloves",
    category: "Supplies",
    stock: 120,
    threshold: 40,
    status: "in-stock",
    unitPrice: 15,
    expiryDate: "2026-06-15",
  },
  {
    id: 6,
    name: "Blood Pressure Monitor",
    category: "Equipment",
    stock: 3,
    threshold: 2,
    status: "in-stock",
    unitPrice: 1500,
    expiryDate: null,
  },
];

const InventoryTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStockPercentage = (stock: number, threshold: number) => {
    const percentage = (stock / (threshold * 2)) * 100;
    return Math.min(percentage, 100);
  };
  
  const getStockColor = (status: string) => {
    switch (status) {
      case "critical": return "text-error-500";
      case "low-stock": return "text-warning-500";
      default: return "text-success-700";
    }
  };
  
  const handleReorder = (id: number) => {
    // Placeholder for backend integration
    toast.success("Reorder initiated successfully");
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Management</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.stock}</span>
                      <span>{item.threshold} (min)</span>
                    </div>
                    <Progress
                      value={getStockPercentage(item.stock, item.threshold)}
                      className="h-2"
                      indicatorClassName={
                        item.status === "critical"
                          ? "bg-error-500"
                          : item.status === "low-stock"
                          ? "bg-warning-500"
                          : "bg-success-500"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{item.expiryDate || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.status === "in-stock"
                        ? "bg-success-500"
                        : item.status === "low-stock"
                        ? "bg-warning-500"
                        : "bg-error-500"
                    }
                  >
                    {item.status === "in-stock"
                      ? "In Stock"
                      : item.status === "low-stock"
                      ? "Low Stock"
                      : "Critical"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {(item.status === "low-stock" || item.status === "critical") ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(item.id)}
                    >
                      Reorder
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Update
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

export default InventoryTable;
