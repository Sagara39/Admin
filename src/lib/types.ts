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
  phoneNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  user_id?: string;
  customerId?: string;
  user_name?: string; 
  orderItems: { name: string; quantity: number; price: number; menuItemId: string; }[];
  totalAmount: number;
  orderDate: Timestamp;
  itemCount: number;
}

export interface DashboardData {
  daily_sales_count: number;
  most_sold_items: { name: string; count: number }[];
  total_credit: number;
}
