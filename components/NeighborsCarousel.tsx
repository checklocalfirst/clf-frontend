"use client";

import Link from "next/link";
import { useRef } from "react";

interface Business {
  category: string;
  name: string;
  neighborhood: string;
  description?: string | null;
  img: string | null;
  href: string;
}

function ArrowButton({
  direction,
  onClick,
  size = "md",
}: {
  direction: "left" | "right";
  onClick: () => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-8 h-8" : "w-11 h-11";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className={`${dim} flex-shrink-0 flex items-center justify-center rounded-full border border-[#dbe0d9] bg-white hover:bg-[#f4f3ee] transition-colors cursor-pointer`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {direction === "left" ? (
          <path d="M10 4L4 8l6 4" stroke="#253022" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 4l6 4-6 4" stroke="#253022" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

export default function NeighborsCarousel({ businesses }: { businesses: Business[] }) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  function scrollBy(ref: { current: HTMLDivElement | null }, dir: "left" | "right", amount: number) {
    ref.current?.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <>
      {/* ── Mobile ── */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col gap-[22px] pt-[52px] pb-[56px]">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-display font-bold text-[17px] text-[#253022]">Meet Your Neighbors</h2>
          <div className="flex items-center gap-2">
            <ArrowButton direction="left" onClick={() => scrollBy(mobileRef, "left", 220)} size="sm" />
            <ArrowButton direction="right" onClick={() => scrollBy(mobileRef, "right", 220)} size="sm" />
            <Link
              href="/businesses"
              className="ml-1 font-display font-bold text-[9px] text-[#596155] tracking-[1.8px] uppercase underline"
            >
              View all
            </Link>
          </div>
        </div>
        <div
          ref={mobileRef}
          className="flex gap-[12px] overflow-x-auto pl-[20px] pr-[20px] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {businesses.map((b) => (
            <Link key={b.name} href={b.href} className="flex flex-col gap-[12px] w-[206px] flex-shrink-0">
              <div className="relative h-[224px] rounded-[2px] overflow-hidden bg-[#b7a78c]">
                {b.img && (
                  <img src={b.img} alt={b.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-display font-bold text-[8px] text-[#b7a78c] tracking-[1.8px] uppercase">
                  {b.category}
                </p>
                <p className="font-display font-bold text-[13px] text-[#253022] leading-[19px]">{b.name}</p>
                <p className="font-body text-[10px] text-[#596155]">{b.neighborhood}</p>
              </div>
              <div className="border border-[#253022] flex items-center justify-center py-[11px] rounded-[2px]">
                <span className="font-display font-bold text-[9px] text-[#253022] tracking-[1.6px] uppercase">
                  View shop
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Desktop ── */}
      <section className="hidden md:flex flex-col gap-12 bg-[#faf6e9] px-20 py-[100px]">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-display font-bold text-[64px] text-[#151814] uppercase">
            Meet Your Neighbors
          </h2>
          <div className="flex items-center gap-3">
            <ArrowButton direction="left" onClick={() => scrollBy(desktopRef, "left", 380)} />
            <ArrowButton direction="right" onClick={() => scrollBy(desktopRef, "right", 380)} />
            <Link
              href="/businesses"
              className="ml-2 font-display font-bold text-[20px] text-[#253022] uppercase flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              View all businesses
            </Link>
          </div>
        </div>
        <div
          ref={desktopRef}
          className="flex gap-8 items-stretch overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {businesses.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="bg-white border border-[#dbe0d9] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(37,48,34,0.04)] flex flex-col gap-3 p-6 w-[360px] flex-shrink-0 hover:shadow-[0px_12px_32px_0px_rgba(37,48,34,0.10)] transition-shadow"
            >
              <p className="font-display font-bold text-[20px] text-[#6b7d67] uppercase">{b.category}</p>
              <p className="font-display font-bold text-[20px] text-[#151814] uppercase">{b.name}</p>
              <div className="relative h-[120px] rounded-[8px] overflow-hidden bg-[#b7a78c] flex-shrink-0">
                {b.img && (
                  <img src={b.img} alt={b.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <p className="font-body text-[20px] text-[#596155] leading-[1.5] line-clamp-2">
                {b.description ?? b.neighborhood}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
