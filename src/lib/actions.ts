"use server";

import { revalidatePath } from "next/cache";
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/firebase/server";
import type { InventoryItem } from "./types";

export async function updateUserCredit(userId: string, newCredit: number) {
  const userRef = doc(firestore, "users", userId);
  updateDocumentNonBlocking(userRef, { credit_balance: newCredit });
  revalidatePath("/users");
  return { success: true };
}

export async function addInventoryItem(item: Omit<InventoryItem, "id" | "name_lowercase">) {
  const collectionRef = collection(firestore, "inventory");
  const data = {
    ...item,
    name_lowercase: item.name.toLowerCase()
  };
  await addDocumentNonBlocking(collectionRef, data);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function updateInventoryItem(item: Partial<InventoryItem> & { id: string }) {
  const docRef = doc(firestore, "inventory", item.id);
  const data: Partial<InventoryItem> & {name_lowercase?: string} = { ...item };
  if (item.name) {
    data.name_lowercase = item.name.toLowerCase();
  }
  await updateDocumentNonBlocking(docRef, data);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function deleteInventoryItem(itemId: string) {
  const docRef = doc(firestore, "inventory", itemId);
  await deleteDocumentNonBlocking(docRef);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}
