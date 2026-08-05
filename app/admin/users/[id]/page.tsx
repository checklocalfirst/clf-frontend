"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToken } from "@/lib/auth";
import { useApiResource } from "@/lib/useApiResource";
import { getAdminUser, deleteAdminUser } from "@/lib/admin/users";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const token = useToken();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: user, loading, error } = useApiResource((t) => getAdminUser(t, id), [id]);

  function handleDelete() {
    confirm.ask({
      title: "Delete this user?",
      body: "This permanently removes their account and login. This can't be undone.",
      confirmLabel: "Delete User",
      onConfirm: async () => {
        if (!token) return;
        await deleteAdminUser(token, id);
        toast.success("User deleted.");
        router.push("/admin/users");
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[480px]">
      <Link
        href="/admin/users"
        className="font-body text-[13px] text-[#b7a78c] hover:text-[#423926] transition-colors w-fit"
      >
        ← Back to Users
      </Link>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {user && (
        <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 md:p-8 flex flex-col gap-4">
          <h2 className="font-display font-bold text-[22px] text-[#423926]">
            {user.first_name} {user.last_name}
          </h2>
          <dl className="flex flex-col gap-2 font-body text-[14px] text-[#596155]">
            <div className="flex justify-between">
              <dt>Email</dt>
              <dd className="text-[#423926]">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Phone</dt>
              <dd className="text-[#423926]">{user.phone ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Account Type</dt>
              <dd className="text-[#423926] capitalize">{user.account_type}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Joined</dt>
              <dd className="text-[#423926]">{new Date(user.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={handleDelete}
            className="self-start border border-red-300 text-red-600 rounded-[8px] px-5 py-[10px] font-display font-bold text-[13px] uppercase hover:bg-red-50 transition-colors cursor-pointer"
          >
            Delete User
          </button>
        </div>
      )}

      {confirm.dialog}
    </div>
  );
}
