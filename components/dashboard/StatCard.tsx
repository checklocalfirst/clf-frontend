export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-[#dbe0d9] rounded-[16px] p-6 flex flex-col gap-2">
      <p className="font-display font-bold text-[12px] text-[#b7a78c] uppercase tracking-widest">{label}</p>
      <p className="font-display font-bold text-[32px] text-[#253022]">{value}</p>
      {hint && <p className="font-body text-[12px] text-[#596155]">{hint}</p>}
    </div>
  );
}
