import { Timestamp } from "firebase/firestore";

export interface InventoryItem {
  id: string;
  name: string;
  name_lowercase: string;
  price: number;
  current_amount: number;
  threshold: number;
}

export interface User {
  id: string;
  name: string;
  credit_balance: number;
}

export interface Order {
  id: string;
  user_id?: string; // Made optional as it's not in screenshot
  user_name?: string; // Made optional as it's not in screenshot
  orderItems: { menuItemId: string; price: number; quantity: number }[];
  totalAmount: number;
  orderDate: Timestamp;
  itemCount: number;
}

export interface DashboardData {
  daily_sales_count: number;
  most_sold_items: { name: string; count: number }[];
  total_credit: number;
}
