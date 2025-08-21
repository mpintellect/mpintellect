// app/admin/page.tsx
// Server Component (safe to use server env + headers here)

import React from "react";
import AdminOrdersClient from "./AdminOrdersClient";
type Order = {
  id: string;
  email?: string | null;
  productId: string;
  productName: string;
  filePath: string;
  amountUsd: number;
  method: "card" | "usdt";
  status: "pending" | "paid" | "expired";
  createdAt: number;
  createdAtISO?: string;
  txid?: string | null;
  ip?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  downloadUsed?: boolean;
};

async function getOrders(): Promise<Order[]> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${base}/api/admin/orders`, {
    method: "GET",
    headers: {
      "x-admin-key": process.env.ADMIN_API_KEY || "",
    },
    // Always fresh
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load orders: ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data?.orders) ? data.orders : [];
}

export default async function AdminPage() {
  const orders = await getOrders();

  // Simple stats
  const totalOrders = orders.length;
  const totalPaid = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + (Number(o.amountUsd) || 0), 0);

  return (
  <div className="admin-container">
    <h1 className="admin-title">Admin · Orders</h1>

    <div className="admin-stats">
      <div className="stat">
        <div className="stat-label">Total Orders</div>
        <div className="stat-value">{orders.length}</div>
      </div>
      <div className="stat">
        <div className="stat-label">Paid Revenue (USD)</div>
        <div className="stat-value">
          $
          {orders
            .filter(o => o.status === 'paid')
            .reduce((s,o)=>s+(Number(o.amountUsd)||0),0)
            .toFixed(2)}
        </div>
      </div>
    </div>

    {/* 👇 replace the old table with the client tool */}
    <AdminOrdersClient initialOrders={orders} />

    <p className="admin-note">
      Filter results and click <b>Export CSV</b> to download the current view.
    </p>
  </div>
);

      <p className="admin-note">
        This view uses <code>/api/admin/orders</code> (secured by{" "}
        <code>x-admin-key</code>). You can add filters/export in the next step.
      </p>
}
<h1 className="page-title">Admin · Orders</h1>