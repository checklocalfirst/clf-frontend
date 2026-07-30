import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#2c4a34] flex items-center justify-center py-[10px]">
      <Link
        href="/membership"
        className="font-display font-bold text-[#faf6e9] text-[13px] tracking-[0.5px] uppercase whitespace-nowrap hover:opacity-80 transition-opacity"
      >
        JOIN THE COMMUNITY →
      </Link>
    </div>
  );
}
