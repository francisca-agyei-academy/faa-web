import type { Metadata } from "next";
import { OrderDetail } from "@/components/admin/orders/OrderDetail";

export const metadata: Metadata = { title: "Order" };

export default function AdminOrderPage() {
  return <OrderDetail />;
}
