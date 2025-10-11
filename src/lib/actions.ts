
"use server";

import { revalidatePath } from "next/cache";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase/server";
import type { InventoryItem } from "./types";

export async function updateUserCredit(userId: string, newCredit: number) {
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, { credit_balance: newCredit });
  revalidatePath("/users");
  return { success: true };
}

export async function addInventoryItem(item: Omit<InventoryItem, "id" | "name_lowercase">) {
  const collectionRef = collection(firestore, "inventory");
  const data = {
    ...item,
    name_lowercase: item.name.toLowerCase()
  };
  await addDoc(collectionRef, data);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function updateInventoryItem(item: Partial<InventoryItem> & { id: string }) {
  const docRef = doc(firestore, "inventory", item.id);
  const data = { ...item };
  if (item.name) {
    data.name_lowercase = item.name.toLowerCase();
  }
  await updateDoc(docRef, data);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function deleteInventoryItem(itemId: string) {
  const docRef = doc(firestore, "inventory", itemId);
  await deleteDoc(docRef);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}
