"use server";

import type { InventoryItem } from "./types";

// Mock server actions for demonstration purposes.
// In a real app, these would interact with Firebase Firestore.

export async function updateUserCredit(userId: string, newCredit: number) {
  console.log(`Updating credit for user ${userId} to ${newCredit}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

export async function addInventoryItem(item: Omit<InventoryItem, "id">) {
  console.log("Adding new inventory item:", item);
  await new Promise(resolve => setTimeout(resolve, 500));
  const newItem: InventoryItem = {
    id: `inv_${Math.random().toString(36).substr(2, 9)}`,
    ...item
  };
  return newItem;
}

export async function updateInventoryItem(item: InventoryItem) {
  console.log(`Updating inventory item ${item.id}:`, item);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

export async function deleteInventoryItem(itemId: string) {
  console.log(`Deleting inventory item ${itemId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}
