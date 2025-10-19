'use client';

import { OrdersTable } from "@/components/orders/orders-table";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { AppShell } from "@/components/layout/app-shell";

export default function OrdersPage() {
    const firestore = useFirestore();
    
    const ordersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'orders'), orderBy('timestamp', 'desc'));
    }, [firestore]);
    
    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    if (isLoading) {
        return <AppShell><div>Loading...</div></AppShell>;
    }

    return (
        <AppShell>
            <OrdersTable orders={orders || []} />
        </AppShell>
    );
}
