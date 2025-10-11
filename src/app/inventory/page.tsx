'use client';

import { useMemo } from 'react';
import { InventoryTable } from "@/components/inventory/inventory-table";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { InventoryItem } from '@/lib/types';

export default function InventoryPage() {
    const firestore = useFirestore();
    
    const inventoryQuery = useMemo(() => {
      if (!firestore) return null;
      return collection(firestore, 'inventory');
    }, [firestore]);

    const { data: inventory, isLoading } = useCollection<InventoryItem>(inventoryQuery);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <InventoryTable inventory={inventory || []} />
        </div>
    );
}
