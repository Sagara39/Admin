"use server";

import { revalidatePath } from "next/cache";
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/server";
import type { InventoryItem, User } from "./types";

// Helper function to generate a short unique ID
function generateShortId() {
    const timestamp = Date.now().toString(36).slice(-4);
    const randomPart = Math.random().toString(36).substring(2, 6);
    return `${timestamp}${randomPart}`;
}

export async function addUser(user: Omit<User, "id">): Promise<{ success: boolean; error?: string }> {
  try {
    const collectionRef = collection(firestore, "users");
    await addDoc(collectionRef, user);
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Error adding user:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: `Failed to add user: ${errorMessage}` };
  }
}

export async function updateUser(userId: string, data: Partial<Omit<User, 'id'>>): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, data);
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: `Failed to update user: ${errorMessage}` };
  }
}

export async function addInventoryItem(item: Omit<InventoryItem, "id" | "name_lowercase">): Promise<{ success: boolean; error?: string }> {
  try {
    const newId = generateShortId();
    // Use the generated ID for the document reference.
    const docRef = doc(firestore, "inventory", newId);
    const data = {
      ...item,
      // Store the ID inside the document as well.
      id: newId,
      name_lowercase: item.name.toLowerCase()
    };
    await setDoc(docRef, data);
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: `Failed to add item to inventory: ${errorMessage}` };
  }
}

export async function updateInventoryItem(item: Partial<InventoryItem> & { id: string }): Promise<{ success: boolean; error?: string }> {
 try {
    const docRef = doc(firestore, "inventory", item.id);
    const dataToUpdate: { [key: string]: any } = { ...item };
    
    if (item.name) {
      dataToUpdate.name_lowercase = item.name.toLowerCase();
    }
    await updateDoc(docRef, dataToUpdate);
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error)
 {
    console.error("Error updating inventory item:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: `Failed to update item: ${errorMessage}` };
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: `Failed to delete item: ${errorMessage}` };
  }
}

export async function placeOrder(order: { orderItems: { menuItemId: string; name: string; price: number; quantity: number }[]; itemCount: number; orderNumber: string; totalAmount: number; }): Promise<{ success: boolean; error?: string }> {
  try {
    const newId = generateShortId();
    const orderRef = doc(firestore, "orders", newId);

    await runTransaction(firestore, async (tx) => {
      // For each item, decrement inventory
      for (const item of order.orderItems) {
        const invRef = doc(firestore, "inventory", item.menuItemId);
        const invSnap = await tx.get(invRef);
        if (!invSnap.exists()) {
          throw new Error(`Inventory item not found: ${item.menuItemId}`);
        }
        const data: any = invSnap.data();
        const current = typeof data.current_amount === 'number' ? data.current_amount : 0;
        if (current < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
        tx.update(invRef, { current_amount: current - item.quantity });
      }

      // Create the order document inside the same transaction
      const orderData = {
        ...order,
        id: newId,
        orderDate: serverTimestamp(),
      };
      tx.set(orderRef, orderData as any);
    });

    revalidatePath("/orders");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error placing order:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: `Failed to place order: ${errorMessage}` };
  }
}
