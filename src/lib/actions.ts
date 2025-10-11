"use server";

import { revalidatePath } from "next/cache";
import { collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase/server";
import type { InventoryItem, User } from "./types";

export async function updateUserCredit(userId: string, newCredit: number): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, { credit_balance: newCredit });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user credit:", error);
    return { success: false, error: "Failed to update user credit." };
  }
}

export async function addInventoryItem(item: Omit<InventoryItem, "id" | "name_lowercase">): Promise<{ success: boolean; error?: string }> {
  try {
    const collectionRef = collection(firestore, "inventory");
    const data = {
      ...item,
      name_lowercase: item.name.toLowerCase()
    };
    await addDoc(collectionRef, data);
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return { success: false, error: "Failed to add item to inventory." };
  }
}

export async function updateInventoryItem(item: Partial<InventoryItem> & { id: string }): Promise<{ success: boolean; error?: string }> {
 try {
    const docRef = doc(firestore, "inventory", item.id);
    const data: Partial<InventoryItem> & {name_lowercase?: string} = { ...item };
    if (item.name) {
      data.name_lowercase = item.name.toLowerCase();
    }
    await updateDoc(docRef, data);
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return { success: false, error: "Failed to update item." };
  }
}

export async function deleteInventoryItem(itemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(firestore, "inventory", itemId);
    await deleteDoc(docRef);
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return { success: false, error: "Failed to delete item." };
  }
}
