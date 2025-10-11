'use client';

import { useMemo } from 'react';
import { UsersTable } from "@/components/users/users-table";
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { User } from '@/lib/types';

export default function UsersPage() {
    const firestore = useFirestore();
    
    const usersQuery = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'users');
    }, [firestore]);

    const { data: users, isLoading } = useCollection<User>(usersQuery);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <UsersTable users={users || []} />
        </div>
    );
}
