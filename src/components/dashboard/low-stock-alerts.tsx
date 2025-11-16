// This component is currently unused. The dashboard is implemented in src/app/page.tsx
// Keeping this file for reference, but imports are disabled.

/*
import { getDashboardData, getInventory } from "@/lib/data";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StockSummaryTable } from "@/components/dashboard/stock-summary-table";

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();
  const inventory = await getInventory();

  const lowStockItems = inventory.filter(
    (item: any) => item.current_amount < item.threshold
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Credit"
          value={`$${dashboardData.total_credit.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Total credit across all users"
        />
        <StatCard
          title="Daily Sales"
          value={`+${dashboardData.daily_sales_count.toLocaleString()}`}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          description="Number of orders placed today"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          description={`${
            inventory.length > 0
              ? (
                  (lowStockItems.length / inventory.length) *
                  100
                ).toFixed(0)
              : 0
          }% of items need restocking`}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <StockSummaryTable inventory={inventory} />
      </div>
    </div>
  );
}
*/

export {};