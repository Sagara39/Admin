import { AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { InventoryItem } from "@/lib/types";

interface LowStockAlertsProps {
  items: InventoryItem[];
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Threshold Alerts</CardTitle>
        <CardDescription>Items that require immediate restocking.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Alert key={item.id} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{item.name} is low!</AlertTitle>
              <AlertDescription>
                Only {item.current_amount} left, below threshold of{" "}
                {item.threshold}.
              </AlertDescription>
            </Alert>
          ))
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            All stock levels are healthy.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
