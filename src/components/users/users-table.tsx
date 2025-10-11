"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";
import { Check, Edit, PlusCircle, X } from "lucide-react";
import { updateUserCredit } from "@/lib/actions";
import { AddUserForm } from "./add-user-form";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [editingCredit, setEditingCredit] = React.useState<number>(0);
  const { toast } = useToast();
  const [isAddFormOpen, setAddFormOpen] = React.useState(false);

  const handleEditClick = (user: User) => {
    setEditingRowId(user.id);
    setEditingCredit(user.credit_balance);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
  };

  const handleSaveClick = async (userId: string) => {
    const result = await updateUserCredit(userId, editingCredit);
    if (result.success) {
      setEditingRowId(null);
      toast({
        title: "Success",
        description: "User credit updated successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update user credit.",
      });
    }
  };

  return (
    <>
      <AddUserForm open={isAddFormOpen} onOpenChange={setAddFormOpen} />
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage user credit balances.
              </CardDescription>
            </div>
            <Button onClick={() => setAddFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New User
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead className="text-right">Credit Balance</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <span className="font-medium">{user.name}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.id}</TableCell>
                  <TableCell className="text-right">
                    {editingRowId === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Input
                            type="number"
                            value={editingCredit}
                            onChange={(e) => setEditingCredit(parseFloat(e.target.value) || 0)}
                            className="w-24 h-8 text-right"
                            autoFocus
                          />
                      </div>
                    ) : (
                      `Rs.${user.credit_balance.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingRowId === user.id ? (
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleSaveClick(user.id)} className="h-8 w-8 text-green-600 hover:text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelClick} className="h-8 w-8 text-red-600 hover:text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
