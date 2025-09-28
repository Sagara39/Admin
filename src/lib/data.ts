import type { DashboardData, InventoryItem, Order, User } from "./types";

const USERS: User[] = [
  { id: 'usr_1', name: 'Alice Johnson', credit_balance: 15.50, last_order_no: 1005, avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'usr_2', name: 'Bob Williams', credit_balance: 5.00, last_order_no: 1003, avatarUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: 'usr_3', name: 'Charlie Brown', credit_balance: 100.25, last_order_no: 1004, avatarUrl: 'https://picsum.photos/seed/3/40/40' },
  { id: 'usr_4', name: 'Diana Miller', credit_balance: 0, last_order_no: null, avatarUrl: 'https://picsum.photos/seed/4/40/40' },
  { id: 'usr_5', name: 'Ethan Davis', credit_balance: 22.80, last_order_no: 1001, avatarUrl: 'https://picsum.photos/seed/5/40/40' },
  { id: 'usr_6', name: 'Fiona Garcia', credit_balance: 3.10, last_order_no: 1002, avatarUrl: 'https://picsum.photos/seed/6/40/40' },
];

const INVENTORY: InventoryItem[] = [
  { id: 'inv_1', name: 'Croissant', current_amount: 45, threshold: 20 },
  { id: 'inv_2', name: 'Sourdough Loaf', current_amount: 15, threshold: 10 },
  { id: 'inv_3', name: 'Chocolate Chip Cookie', current_amount: 8, threshold: 24 },
  { id: 'inv_4', name: 'Baguette', current_amount: 30, threshold: 15 },
  { id: 'inv_5', name: 'Cinnamon Roll', current_amount: 12, threshold: 12 },
  { id: 'inv_6', name: 'Blueberry Muffin', current_amount: 35, threshold: 20 },
  { id: 'inv_7', name: 'Pain au Chocolat', current_amount: 9, threshold: 15 },
];

const ORDERS: Order[] = [
  { id: 1005, user_id: 'usr_1', user_name: 'Alice Johnson', items: [{ name: 'Croissant', quantity: 2 }], amount: 5.00, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 1004, user_id: 'usr_3', user_name: 'Charlie Brown', items: [{ name: 'Sourdough Loaf', quantity: 1 }, { name: 'Baguette', quantity: 1 }], amount: 12.50, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 1003, user_id: 'usr_2', user_name: 'Bob Williams', items: [{ name: 'Chocolate Chip Cookie', quantity: 3 }], amount: 4.50, timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() },
  { id: 1002, user_id: 'usr_6', user_name: 'Fiona Garcia', items: [{ name: 'Cinnamon Roll', quantity: 1 }], amount: 3.75, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 1001, user_id: 'usr_5', user_name: 'Ethan Davis', items: [{ name: 'Pain au Chocolat', quantity: 2 }, { name: 'Blueberry Muffin', quantity: 1 }], amount: 8.25, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

const DASHBOARD_DATA: DashboardData = {
  daily_sales_count: 2,
  most_sold_items: [
    { name: 'Croissant', count: 125 },
    { name: 'Sourdough Loaf', count: 80 },
    { name: 'Baguette', count: 75 },
  ],
  total_credit: USERS.reduce((acc, user) => acc + user.credit_balance, 0),
};

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getUsers(): Promise<User[]> {
  await delay(100);
  return USERS;
}

export async function getInventory(): Promise<InventoryItem[]> {
  await delay(150);
  return INVENTORY;
}

export async function getOrders(): Promise<Order[]> {
  await delay(200);
  return ORDERS;
}

export async function getDashboardData(): Promise<DashboardData> {
  await delay(50);
  return {
    ...DASHBOARD_DATA,
    total_credit: USERS.reduce((acc, user) => acc + user.credit_balance, 0)
  };
}
