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
import { updateUser } from "@/lib/actions";
import { AddUserForm } from "./add-user-form";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [editingRow, setEditingRow] = React.useState<Partial<User> & { id: string } | null>(null);
  const { toast } = useToast();
  const [isAddFormOpen, setAddFormOpen] = React.useState(false);

  const handleEditClick = (user: User) => {
    setEditingRow({ ...user });
  };

  const handleCancelClick = () => {
    setEditingRow(null);
  };
  
  const handleFieldChange = (field: keyof Omit<User, 'id'>, value: string | number) => {
    if (editingRow) {
      setEditingRow({ ...editingRow, [field]: value });
    }
  };

  const handleSaveClick = async () => {
    if (!editingRow) return;

    // Create a plain object with only the fields we want to update.
    // This prevents passing complex objects like Timestamps to the server action.
    const dataToUpdate: Partial<Omit<User, 'id'>> = {
      name: editingRow.name,
      credit_balance: editingRow.credit_balance,
      phoneNumber: editingRow.phoneNumber,
    };
    
    const result = await updateUser(editingRow.id, dataToUpdate);

    if (result.success) {
      setEditingRow(null);
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update user.",
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
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-right">Credit Balance</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editingRow?.id === user.id ? (
                      <Input
                        value={editingRow.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{user.name}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.id}</TableCell>
                  <TableCell>
                     {editingRow?.id === user.id ? (
                      <Input
                        value={editingRow.phoneNumber || ''}
                        onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      user.phoneNumber || 'N/A'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingRow?.id === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Input
                            type="number"
                            value={editingRow.credit_balance ?? 0}
                            onChange={(e) => handleFieldChange('credit_balance', parseFloat(e.target.value) || 0)}
                            className="w-24 h-8 text-right"
                          />
                      </div>
                    ) : (
                      `Rs.${(user.credit_balance || 0).toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingRow?.id === user.id ? (
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleSaveClick} className="h-8 w-8 text-green-600 hover:text-green-600">
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
