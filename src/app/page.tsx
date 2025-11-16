'use client';

import { useCollection } from "@/firebase/firestore/use-collection";
import { Package, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StockSummaryTable } from "@/components/dashboard/stock-summary-table";
import Link from "next/link";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import type { InventoryItem } from "@/lib/types";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardPage() {
  const firestore = useFirestore();
  
  const inventoryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "inventory");
  }, [firestore]);
  const { data: inventory, isLoading: inventoryLoading } = useCollection<InventoryItem>(inventoryQuery);

  const [dailySalesCount, setDailySalesCount] = useState(0);

  useEffect(() => {
    if (!firestore) return;
    
    const getDailySales = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfToday = Timestamp.fromDate(today);

      const ordersQuery = query(
        collection(firestore, "orders"),
        where("timestamp", ">=", startOfToday)
      );
      
      const querySnapshot = await getDocs(ordersQuery);
      setDailySalesCount(querySnapshot.size);
    };

    getDailySales();
  }, [firestore]);

  const lowStockItems = useMemo(() => {
    if (!inventory) return [];
    return inventory.filter(
      (item) => item.current_amount < item.threshold
    );
  }, [inventory]);

  if (inventoryLoading) {
    return <div>Loading...</div>
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-end">
          {/* Desktop / tablet: large prominent button */}
          <Link href="/orders/new" className="hidden md:inline-block">
            <button className="rounded-lg bg-primary px-8 py-5 text-primary-foreground text-2xl font-semibold shadow-2xl hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary/40">
              New Order
            </button>
          </Link>

          {/* Floating quick-access button for small screens */}
          <Link href="/orders/new" className="md:hidden">
            <button aria-label="New Order" className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground h-16 w-16 shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Daily Sales"
            value={`+${dailySalesCount.toLocaleString()}`}
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            description="Number of orders placed today"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockItems.length}
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            description={`${
              inventory && inventory.length > 0
                ? (
                    (lowStockItems.length / inventory.length) *
                    100
                  ).toFixed(0)
                : 0
            }% of items need restocking`}
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <StockSummaryTable inventory={inventory || []} />
        </div>
      </div>
    </AppShell>
  );
}
