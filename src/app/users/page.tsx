"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

export default function UsersPage() {
    return (
        <AppShell>
            <div className="mx-auto max-w-3xl rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold">Users section removed</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    The Users management section has been removed from this application to
                    focus the UI on pharmacy inventory and orders. If you need to manage
                    users, that functionality has been archived.
                </p>
                <div className="mt-4 flex gap-2">
                    <Link href="/inventory" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white">
                        Go to Inventory
                    </Link>
                    <Link href="/" className="inline-flex items-center rounded-md border px-3 py-2 text-sm">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}
