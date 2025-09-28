import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
        <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                <LineChart className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4 text-2xl">Reports Coming Soon</CardTitle>
        </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This section is under construction. Check back later for detailed sales and inventory reports.
        </p>
      </CardContent>
    </Card>
  );
}
