import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { InventoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StockSummaryTableProps {
  inventory: InventoryItem[];
}

export function StockSummaryTable({ inventory }: StockSummaryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Stock Summary</CardTitle>
        <CardDescription>
          An overview of all items in the inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead className="text-right">Current Amount</TableHead>
              <TableHead className="text-right">Threshold</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const isLow = item.current_amount < item.threshold;
              return (
                <TableRow key={item.id} className={cn(isLow && "bg-destructive/10")}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-semibold",
                      isLow && "text-destructive"
                    )}
                  >
                    {item.current_amount}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.threshold}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={isLow ? "destructive" : "outline"} className={!isLow ? "border-green-500 text-green-600" : ""}>
                        {isLow ? "Low" : "Healthy"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
