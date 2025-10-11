"use server";

import { revalidatePath } from "next/cache";
import { collection, addDoc, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import type { InventoryItem, Order, User } from "./types";
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  setDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';


const { firestore } = initializeFirebase();

export async function updateUserCredit(userId: string, newCredit: number) {
  const userRef = doc(firestore, "users", userId);
  updateDocumentNonBlocking(userRef, { credit_balance: newCredit });
  revalidatePath("/users");
  return { success: true };
}

export async function addInventoryItem(item: Omit<InventoryItem, "id">) {
  const collectionRef = collection(firestore, "inventory");
  const data = {
    ...item,
    name_lowercase: item.name.toLowerCase()
  };
  await addDocumentNonBlocking(collectionRef, data);
  revalidatePath("/inventory");
  return { success: true };
}

export async function updateInventoryItem(item: InventoryItem) {
  const docRef = doc(firestore, "inventory", item.id);
  const data = {
      ...item,
      name_lowercase: item.name.toLowerCase()
  };
  updateDocumentNonBlocking(docRef, data);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}

export async function deleteInventoryItem(itemId: string) {
  const docRef = doc(firestore, "inventory", itemId);
  deleteDocumentNonBlocking(docRef);
  revalidatePath("/inventory");
  revalidatePath("/");
  return { success: true };
}