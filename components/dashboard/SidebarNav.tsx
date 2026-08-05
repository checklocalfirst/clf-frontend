"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLink {
  label: string;
  href: string;
}

export default function SidebarNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
      {links.map(({ label, href }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`whitespace-nowrap font-display font-bold text-[13px] uppercase px-4 py-3 rounded-[8px] transition-colors ${
              active
                ? "bg-[#2c4a34] text-white"
                : "text-[#596155] hover:bg-[#f0f5ee] hover:text-[#253022]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
