import { InventoryTable } from "@/components/inventory/inventory-table";
import { getInventory } from "@/lib/data";

export default async function InventoryPage() {
    const inventory = await getInventory();

    return (
        <div>
            <InventoryTable inventory={inventory} />
        </div>
    );
}
