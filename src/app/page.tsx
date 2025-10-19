'use client';

import { useCollection } from "@/firebase/firestore/use-collection";
import { Package, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StockSummaryTable } from "@/components/dashboard/stock-summary-table";
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
