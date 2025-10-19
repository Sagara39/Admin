'use client';

import { UsersTable } from "@/components/users/users-table";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { AppShell } from "@/components/layout/app-shell";

export default function UsersPage() {
    const firestore = useFirestore();
    
    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'users');
    }, [firestore]);

    const { data: users, isLoading } = useCollection<User>(usersQuery);

    if (isLoading) {
        return <AppShell><div>Loading...</div></AppShell>;
    }

    return (
        <AppShell>
            <UsersTable users={users || []} />
        </AppShell>
    );
}
