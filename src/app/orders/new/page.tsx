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
import { addDoc, collection as clientCollection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { placeOrder as placeOrderAction } from "@/lib/actions";
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

  // Generate next order number based on latest order in Firestore.
  // Format: LetterPrefix + 4 digits (or more) e.g. A1001 ... A9999 then B0001
  const generateOrderNumber = async (): Promise<string> => {
    try {
      const ordersQuery = query(clientCollection(firestore, "orders"), orderBy("orderDate", "desc"), limit(1));
      const snap = await getDocs(ordersQuery);
      if (snap.empty) {
        return "A1001";
      }
      const doc = snap.docs[0];
      const last = (doc.data() as any).orderNumber as string | undefined;
      if (!last || typeof last !== "string") return "A1001";

      // Parse like 'A1001' or 'B0001'
      const prefix = last.charAt(0);
      const numPart = parseInt(last.slice(1), 10);
      if (isNaN(numPart)) return "A1001";

      if (numPart >= 9999) {
        // move to next letter and reset to 0001
        const nextChar = String.fromCharCode(prefix.charCodeAt(0) + 1);
        return `${nextChar}${String(1).padStart(4, "0")}`;
      }

      const nextNum = numPart + 1;
      // Keep the same width as previous numeric part when possible
      const width = Math.max(4, last.slice(1).length);
      return `${prefix}${String(nextNum).padStart(width, "0")}`;
    } catch (err) {
      console.error("generateOrderNumber error", err);
      // fallback
      const tail = Date.now().toString().slice(-5);
      return `A${tail}`;
    }
  };

  const placeOrder = async () => {
    if (!firestore) return toast({ variant: "destructive", title: "Error", description: "Firestore unavailable." });
    if (cart.length === 0) return toast({ variant: "destructive", title: "Cart is empty" });

    const orderItems = cart.map((c) => ({ menuItemId: c.id, name: c.name, price: c.price, quantity: c.quantity }));
    const itemCount = cart.reduce((s, c) => s + c.quantity, 0);
    const orderNumber = await generateOrderNumber();

    const orderPayload = {
      orderItems,
      itemCount,
      orderNumber,
      status: "completed",
      totalAmount: total,
    };

    try {
      const result = await placeOrderAction(orderPayload as any);
      if (result.success) {
        toast({ title: "Order placed", description: `Order ${orderNumber} created.` });
        router.push("/orders");
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to place order." });
      }
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
