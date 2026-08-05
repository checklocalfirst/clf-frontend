"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiResource } from "@/lib/useApiResource";
import { listAdminUsers, type AdminUser } from "@/lib/admin/users";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import Pager from "@/components/dashboard/Pager";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApiResource((t) => listAdminUsers(t, { page, limit: 20 }), [page]);

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <Link
          href={`/admin/users/${u.user_id}`}
          className="font-display font-bold text-[13px] text-[#253022] hover:underline"
        >
          {u.first_name} {u.last_name}
        </Link>
      ),
    },
    { key: "email", header: "Email", render: (u) => u.email },
    { key: "type", header: "Account Type", render: (u) => <span className="capitalize">{u.account_type}</span> },
    { key: "created", header: "Created", render: (u) => new Date(u.created_at).toLocaleDateString() },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[24px] text-[#423926]">Users</h2>
      {loading && <p className="font-body text-[14px] text-[#596155]">Loading users…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}
      {data && (
        <>
          <DataTable columns={columns} rows={data.data} rowKey={(u) => u.user_id} emptyMessage="No users yet." />
          <Pager page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
