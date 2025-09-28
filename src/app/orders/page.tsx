import { OrdersTable } from "@/components/orders/orders-table";
import { getOrders } from "@/lib/data";

export default async function OrdersPage() {
    const orders = await getOrders();
    return (
        <div>
            <OrdersTable orders={orders} />
        </div>
    );
}
