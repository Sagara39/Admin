'use client';

import { InventoryTable } from "@/components/inventory/inventory-table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { InventoryItem } from '@/lib/types';
import { AppShell } from "@/components/layout/app-shell";

export default function InventoryPage() {
    const firestore = useFirestore();
    
    const inventoryQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'inventory');
    }, [firestore]);

    const { data: inventory, isLoading } = useCollection<InventoryItem>(inventoryQuery);

    if (isLoading) {
        return <AppShell><div>Loading...</div></AppShell>;
    }

    return (
        <AppShell>
            <InventoryTable inventory={inventory || []} />
        </AppShell>
    );
}
