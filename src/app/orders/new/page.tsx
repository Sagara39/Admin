"use client";

import * as React from "react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { InventoryItem } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppShell } from "@/components/layout/app-shell";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection as clientCollection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function NewOrderPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const inventoryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "inventory");
  }, [firestore]);

  const { data: inventory, isLoading } = useCollection<InventoryItem>(inventoryQuery);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [cart, setCart] = React.useState<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[]>([]);

  const filtered = React.useMemo(() => {
    const s = searchTerm.toLowerCase();
    if (!inventory) return [];
    return inventory.filter((it) => it.name.toLowerCase().includes(s) || it.id.toLowerCase().includes(s));
  }, [inventory, searchTerm]);

  const addToCart = (item: InventoryItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + qty } : p);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: qty }];
    });
    toast({ title: "Added", description: `${item.name} added to cart` });
  };

  const updateQty = (id: string, qty: number) => {
    setCart((prev) => prev.map((p) => p.id === id ? { ...p, quantity: Math.max(1, qty) } : p));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const total = React.useMemo(() => cart.reduce((s, c) => s + c.price * c.quantity, 0), [cart]);

  // Generate a simple order number like A1004 (prefix + last 5 digits of timestamp)
  const generateOrderNumber = () => {
    const tail = Date.now().toString().slice(-5);
    return `A${tail}`;
  };

  const placeOrder = async () => {
    if (!firestore) return toast({ variant: "destructive", title: "Error", description: "Firestore unavailable." });
    if (cart.length === 0) return toast({ variant: "destructive", title: "Cart is empty" });

    const orderItems = cart.map((c) => ({ menuItemId: c.id, name: c.name, price: c.price, quantity: c.quantity }));
    const itemCount = cart.reduce((s, c) => s + c.quantity, 0);
    const orderNumber = generateOrderNumber();

    const orderPayload = {
      orderItems,
      itemCount,
      orderNumber,
      orderDate: serverTimestamp(),
      status: "completed",
      totalAmount: total,
    };

    try {
      const col = clientCollection(firestore, "orders");
      const docRef = await addDoc(col, orderPayload as any);

      // Optionally, you can ensure the document contains its own id (not required by your format example)
      toast({ title: "Order placed", description: `Order ${orderNumber} created.` });
      router.push("/orders");
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to place order." });
    }
  };

  if (isLoading) return (
    <AppShell><div>Loading...</div></AppShell>
  );

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Search Medicines</CardTitle>
              <CardDescription>Find medicines by name or ID and add them to the cart.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Input placeholder="Search by medicine name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-center">Add</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">Rs.{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.current_amount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" onClick={() => addToCart(item, 1)}>Add</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
              <CardDescription>Review items before placing the order.</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-sm text-muted-foreground">Cart is empty.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="text-center">Remove</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="text-right">Rs.{c.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <input type="number" className="w-20 rounded border px-2 py-1 text-right" value={c.quantity} onChange={(e) => updateQty(c.id, parseInt(e.target.value || "0"))} />
                        </TableCell>
                        <TableCell className="text-right">Rs.{(c.price * c.quantity).toFixed(2)}</TableCell>
                        <TableCell className="text-center"><Button variant="ghost" size="icon" onClick={() => removeFromCart(c.id)}>Remove</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <div className="mt-4 text-right">
                <div className="text-sm">Total: <span className="font-semibold">Rs.{total.toFixed(2)}</span></div>
                <div className="mt-3 flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => router.push('/orders')}>Cancel</Button>
                  <Button onClick={placeOrder}>Place Order</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
