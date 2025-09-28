export interface InventoryItem {
  id: string;
  name: string;
  current_amount: number;
  threshold: number;
}

export interface User {
  id: string;
  name: string;
  credit_balance: number;
  last_order_no: number | null;
  avatarUrl: string;
}

export interface Order {
  id: number;
  user_id: string;
  user_name: string;
  items: { name: string; quantity: number }[];
  amount: number;
  timestamp: string;
}

export interface DashboardData {
  daily_sales_count: number;
  most_sold_items: { name: string; count: number }[];
  total_credit: number;
}
