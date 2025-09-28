import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData, getInventory } from "@/lib/data";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { StockSummaryTable } from "@/components/dashboard/stock-summary-table";

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();
  const inventory = await getInventory();

  const lowStockItems = inventory.filter(
    (item) => item.current_amount < item.threshold
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
            (
              (lowStockItems.length / inventory.length) *
              100
            ).toFixed(0)
          }% of items need restocking`}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StockSummaryTable inventory={inventory} />
        </div>
        <div className="flex flex-col gap-8">
          <LowStockAlerts items={lowStockItems} />
          <Card>
            <CardHeader>
              <CardTitle>Most Sold Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dashboardData.most_sold_items.map((item) => (
                  <li key={item.name} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.count} sold</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
