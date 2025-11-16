"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Order } from "@/lib/types";
import { format } from "date-fns";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOrders = initialOrders.filter(
    (order) =>
      (order.orderNumber?.toString() ?? '').includes(searchTerm.toLowerCase()) ||
      (order.userId ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_phone ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            A list of all recent orders placed in the system.
          </CardDescription>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Order No. or User..."
            className="pl-8 sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order No.</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.userId ?? order.user_name}</div>
                    {order.user_phone && (
                      <div className="text-sm text-muted-foreground">
                        {order.user_phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.orderItems
                      .map((item) => `${item.name} (x${item.quantity})`)
                      .join(", ")}
                  </TableCell>
                   <TableCell>
                    {order.orderDate && format(order.orderDate.toDate(), "PPP")}
                  </TableCell>
                  <TableCell className="text-right">
                    Rs.{order.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
