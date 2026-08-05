"use client";

import { useToken } from "@/lib/auth";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import {
  getAllRedemptions,
  markRedemptionUsed,
  deleteRedemption,
  type Redemption,
} from "@/lib/business-dashboard";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import Toggle from "@/components/dashboard/Toggle";
import { useConfirm } from "@/components/dashboard/ConfirmDialog";
import { useToast } from "@/components/dashboard/ToastProvider";

export default function DiscountRedemptionsPage() {
  const token = useToken();
  const { business } = useBusiness();
  const toast = useToast();
  const confirm = useConfirm();

  const { data: redemptions, loading, error, setData: setRedemptions } = useApiResource<Redemption[]>(
    (t) => getAllRedemptions(t, business.slug),
    [business.slug]
  );

  function handleUsedToggle(r: Redemption, used: boolean) {
    const customerName = r.users ? `${r.users.first_name} ${r.users.last_name}` : "This customer";
    confirm.ask({
      title: used ? "Mark this redemption as used?" : "Mark this redemption as not used?",
      body: used
        ? `Confirm that ${customerName} redeemed this code in person.`
        : `This will mark ${customerName}'s redemption as not yet used.`,
      confirmLabel: used ? "Mark Used" : "Mark Unused",
      danger: !used,
      onConfirm: async () => {
        if (!token) return;
        // The PATCH response only returns the bare row — no joined `users`/`discounts` —
        // so merge onto the existing row instead of replacing it wholesale.
        const updated = await markRedemptionUsed(token, business.slug, r.discount_id, r.id, used);
        setRedemptions((prev) => prev?.map((x) => (x.id === r.id ? { ...x, ...updated } : x)) ?? null);
      },
    });
  }

  function handleDelete(r: Redemption) {
    const customerName = r.users ? `${r.users.first_name} ${r.users.last_name}` : "This customer";
    confirm.ask({
      title: "Delete this redemption?",
      body: `${customerName} will be able to redeem this discount again.`,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        if (!token) return;
        await deleteRedemption(token, business.slug, r.discount_id, r.id);
        setRedemptions((prev) => prev?.filter((x) => x.id !== r.id) ?? null);
        toast.success("Redemption deleted.");
      },
    });
  }

  const columns: Column<Redemption>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (r) => (
        <div>
          <p className="font-body text-[13px] text-[#423926]">
            {r.users ? `${r.users.first_name} ${r.users.last_name}` : "—"}
          </p>
          <p className="font-body text-[12px] text-[#898781]">{r.users?.email ?? ""}</p>
        </div>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (r) => r.discounts?.description ?? `#${r.discount_id}`,
    },
    {
      key: "redeemed_at",
      header: "Redeemed",
      render: (r) => new Date(r.redeemed_at).toLocaleDateString(),
    },
    {
      key: "used",
      header: "Used",
      render: (r) => (
        <Toggle checked={r.used} onChange={(next) => handleUsedToggle(r, next)} label="Used" />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <button
          type="button"
          onClick={() => handleDelete(r)}
          className="font-display font-bold text-[11px] text-[#b7a78c] uppercase hover:text-red-600 transition-colors cursor-pointer"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Redemptions</h2>
        <p className="font-body text-[13px] text-[#596155] mt-1">
          Everyone who&apos;s redeemed one of your discount codes. Mark a redemption used once the customer
          actually comes in — deleting a redemption instead frees them up to redeem it again.
        </p>
      </div>

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading redemptions…</p>}
      {error && <p className="font-body text-[14px] text-red-600">{error}</p>}

      {redemptions && (
        <DataTable
          columns={columns}
          rows={redemptions}
          rowKey={(r) => r.id}
          emptyMessage="No one has redeemed a discount yet."
        />
      )}

      {confirm.dialog}
    </div>
  );
}
