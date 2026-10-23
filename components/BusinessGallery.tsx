"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
// 3+ switches to a fixed-tile horizontal scroller with arrow controls and autoscroll.
const SCROLL_THRESHOLD = 3;

const AUTOSCROLL_PX_PER_TICK = 1;
const AUTOSCROLL_INTERVAL_MS = 30;
const AUTOSCROLL_RESUME_DELAY_MS = 2500;

export default function BusinessGallery({
  photos,
  businessName,
}: {
  photos: GalleryPhoto[];
  businessName: string;
}) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollable = photos.length >= SCROLL_THRESHOLD;

  // Creeps both scrollers rightward and loops back to the start — only kicks
  // in once there are enough photos that scrolling is actually possible.
  useEffect(() => {
    if (!scrollable || paused) return;
    const interval = setInterval(() => {
      for (const ref of [desktopRef, mobileRef]) {
        const el = ref.current;
        if (!el) continue;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) continue;
        el.scrollLeft = el.scrollLeft >= maxScroll - 1 ? 0 : el.scrollLeft + AUTOSCROLL_PX_PER_TICK;
      }
    }, AUTOSCROLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [scrollable, paused]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Manual interaction (arrow click, touch drag) pauses autoscroll briefly
  // instead of fighting the user's own scroll.
  function pauseThenResume() {
    setPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setPaused(false), AUTOSCROLL_RESUME_DELAY_MS);
  }

  if (photos.length === 0) return null;

  function scrollBy(ref: { current: HTMLDivElement | null }, dir: "left" | "right", amount: number) {
    pauseThenResume();
    ref.current?.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:block bg-[#faf6e9] px-[64px] pt-[16px] pb-[48px]">
        {scrollable && (
          <div className="flex items-center justify-end gap-3 mb-[24px]">
            <ArrowButton direction="left" onClick={() => scrollBy(desktopRef, "left", 400)} />
            <ArrowButton direction="right" onClick={() => scrollBy(desktopRef, "right", 400)} />
          </div>
        )}
        <div
          ref={desktopRef}
          onMouseEnter={() => scrollable && setPaused(true)}
          onMouseLeave={() => scrollable && setPaused(false)}
          className={
            scrollable
              ? "flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "flex gap-6 justify-center"
          }
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={
                scrollable
                  ? "relative w-[380px] aspect-square flex-shrink-0 rounded-[12px] overflow-hidden bg-[#c9d2cf]"
                  : // Square photos are capped so a lone one doesn't grow to the full page width.
                    "relative w-[500px] max-w-full aspect-square rounded-[12px] overflow-hidden bg-[#c9d2cf]"
              }
            >
              <Image
                src={photo.url}
                alt={`${businessName} gallery photo ${i + 1}`}
                fill
                sizes={scrollable ? "380px" : "500px"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden px-[16px] pt-[8px] pb-[32px]">
        {scrollable && (
          <div className="flex items-center justify-end gap-2 mb-[16px]">
            <ArrowButton direction="left" onClick={() => scrollBy(mobileRef, "left", 220)} size="sm" />
            <ArrowButton direction="right" onClick={() => scrollBy(mobileRef, "right", 220)} size="sm" />
          </div>
        )}
        <div
          ref={mobileRef}
          onTouchStart={() => scrollable && pauseThenResume()}
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
                  ? "relative w-[220px] aspect-square flex-shrink-0 rounded-[10px] overflow-hidden bg-[#c9d2cf]"
                  : photos.length === 1
                    ? "relative w-full aspect-square rounded-[10px] overflow-hidden bg-[#c9d2cf]"
                    : "relative flex-1 aspect-square rounded-[10px] overflow-hidden bg-[#c9d2cf]"
              }
            >
              <Image
                src={photo.url}
                alt={`${businessName} gallery photo ${i + 1}`}
                fill
                sizes={scrollable ? "220px" : photos.length === 1 ? "100vw" : "50vw"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
