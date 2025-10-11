'use client';

import { OrdersTable } from "@/components/orders/orders-table";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
    const firestore = useFirestore();
    
    const ordersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'orders'), orderBy('timestamp', 'desc'));
    }, [firestore]);
    
    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <OrdersTable orders={orders || []} />
        </div>
    );
}
