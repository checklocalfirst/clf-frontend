"use client";

import Image from "next/image";
import { useRef } from "react";

interface GalleryPhoto {
  id: number;
  url: string;
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
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {direction === "left" ? (
          <path d="M10 4L4 8l6 4" stroke="#253022" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 4l6 4-6 4" stroke="#253022" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

// 1-2 photos lay out full-size side by side (no point scrolling what already fits);
// 3+ switches to a fixed-tile horizontal scroller with arrow controls.
const SCROLL_THRESHOLD = 3;

export default function BusinessGallery({
  photos,
  businessName,
}: {
  photos: GalleryPhoto[];
  businessName: string;
}) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  if (photos.length === 0) return null;

  const scrollable = photos.length >= SCROLL_THRESHOLD;

  function scrollBy(ref: { current: HTMLDivElement | null }, dir: "left" | "right", amount: number) {
    ref.current?.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:block bg-[#faf6e9] px-[64px] pt-[16px] pb-[48px]">
        <div className="flex items-center justify-between mb-[24px]">
          <h2 className="font-display font-bold text-[64px] text-[#423926] tracking-[0.64px] leading-none">
            GALLERY
          </h2>
          {scrollable && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <ArrowButton direction="left" onClick={() => scrollBy(desktopRef, "left", 400)} />
              <ArrowButton direction="right" onClick={() => scrollBy(desktopRef, "right", 400)} />
            </div>
          )}
        </div>
        <div
          ref={desktopRef}
          className={
            scrollable
              ? "flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "flex gap-6"
          }
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={
                scrollable
                  ? "relative w-[380px] h-[380px] flex-shrink-0 rounded-[12px] overflow-hidden bg-[#c9d2cf]"
                  : photos.length === 1
                    ? "relative w-full h-[500px] rounded-[12px] overflow-hidden bg-[#c9d2cf]"
                    : "relative flex-1 h-[420px] rounded-[12px] overflow-hidden bg-[#c9d2cf]"
              }
            >
              <Image
                src={photo.url}
                alt={`${businessName} gallery photo ${i + 1}`}
                fill
                sizes={scrollable ? "380px" : photos.length === 1 ? "1120px" : "50vw"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden px-[16px] pt-[8px] pb-[32px]">
        <div className="flex items-center justify-between mb-[16px]">
          <h2 className="font-display font-bold text-[26px] text-[#423926] tracking-[0.26px] leading-none">
            GALLERY
          </h2>
          {scrollable && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <ArrowButton direction="left" onClick={() => scrollBy(mobileRef, "left", 220)} size="sm" />
              <ArrowButton direction="right" onClick={() => scrollBy(mobileRef, "right", 220)} size="sm" />
            </div>
          )}
        </div>
        <div
          ref={mobileRef}
          className={
            scrollable
              ? "flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "flex gap-3"
          }
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={
                scrollable
                  ? "relative w-[220px] h-[220px] flex-shrink-0 rounded-[10px] overflow-hidden bg-[#c9d2cf]"
                  : photos.length === 1
                    ? "relative w-full h-[260px] rounded-[10px] overflow-hidden bg-[#c9d2cf]"
                    : "relative flex-1 h-[200px] rounded-[10px] overflow-hidden bg-[#c9d2cf]"
              }
            >
              <Image
                src={photo.url}
                alt={`${businessName} gallery photo ${i + 1}`}
                fill
                sizes={scrollable ? "220px" : "50vw"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
