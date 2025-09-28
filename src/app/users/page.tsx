import { UsersTable } from "@/components/users/users-table";
import { getUsers } from "@/lib/data";

export default async function UsersPage() {
    const users = await getUsers();
    return (
        <div>
            <UsersTable users={users} />
        </div>
    );
}
