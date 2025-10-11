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
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem } from "@/lib/types";
import { Check, Edit, PlusCircle, Trash2, X } from "lucide-react";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddItemForm } from "./add-item-form";
import { deleteInventoryItem, updateInventoryItem } from "@/lib/actions";

interface InventoryTableProps {
  inventory: InventoryItem[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const [isAddFormOpen, setAddFormOpen] = React.useState(false);
  const { toast } = useToast();

  const [editingRow, setEditingRow] = React.useState<Partial<InventoryItem> & {id: string} | null>(null);

  const handleEditClick = (item: InventoryItem) => {
    setEditingRow({...item});
  };

  const handleCancelClick = () => {
    setEditingRow(null);
  };
  
  const handleFieldChange = (field: keyof Omit<InventoryItem, 'id'>, value: string) => {
    if (editingRow) {
      const numericValue = ['current_amount', 'threshold'].includes(field) ? parseInt(value, 10) : value;
      setEditingRow({ ...editingRow, [field]: numericValue });
    }
  };

  const handleSaveClick = async () => {
    if (!editingRow) return;

    try {
      await updateInventoryItem(editingRow as InventoryItem);
      setEditingRow(null);
      toast({
        title: "Success",
        description: "Item updated successfully.",
      });
    } catch(e) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item.",
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteInventoryItem(itemId);
      toast({
        variant: "destructive",
        title: "Item Deleted",
        description: "The inventory item has been removed.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item.",
      });
    }
  };

  return (
    <>
      <AddItemForm open={isAddFormOpen} onOpenChange={setAddFormOpen} />
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Add, update, or remove bakery items.
            </CardDescription>
          </div>
          <Button onClick={() => setAddFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Threshold</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {editingRow?.id === item.id ? (
                      <Input value={editingRow.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="h-8" />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingRow?.id === item.id ? (
                      <Input type="number" value={editingRow.current_amount} onChange={(e) => handleFieldChange('current_amount', e.target.value)} className="h-8 w-24 text-right ml-auto" />
                    ) : (
                      item.current_amount
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingRow?.id === item.id ? (
                      <Input type="number" value={editingRow.threshold} onChange={(e) => handleFieldChange('threshold', e.target.value)} className="h-8 w-24 text-right ml-auto" />
                    ) : (
                      item.threshold
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingRow?.id === item.id ? (
                       <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleSaveClick} className="h-8 w-8 text-green-600 hover:text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelClick} className="h-8 w-8 text-red-600 hover:text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the item "{item.name}" from the inventory.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
