// app/admin/page.tsx
// Server Component (safe to use server env + headers here)

import AdminOrdersClient from "./AdminOrdersClient";

type Order = {
  id: string;
  email?: string | null;
  productId: string;
  productName: string;
  filePath: string;
  amountUsd: number;
  method: "card";
  status: "pending" | "paid" | "expired";
  createdAt: number;
  createdAtISO?: string;
  txid?: string | null;
  ip?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  downloadUsed?: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load orders: ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data?.orders) ? (data.orders as Order[]) : [];
}

export default async function AdminPage() {
  const orders = await getOrders();

  const paidRevenue = orders
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
          <div className="stat-value">${paidRevenue.toFixed(2)}</div>
        </div>
      </div>

      <AdminOrdersClient initialOrders={orders} />

      <p className="admin-note">
        This view uses <code>/api/admin/orders</code> (secured by{" "}
        <code>x-admin-key</code>). Filter results and click <b>Export CSV</b> to
        download the current view.
      </p>
    </div>
  );
}