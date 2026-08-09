"use client";

import Image from "next/image";
import { useState } from "react";

const PHOTOS = [
  "/breadcompany.JPG",
  "/farmers1.JPG",
  "/modestmix.JPG",
  "/sasquatchsnacks.jpg",
  "/market.JPG",
];

const VISIBLE = 5;
const TOTAL = PHOTOS.length;

// Three copies back-to-back so sliding past either edge always reveals more real
// photos instead of jump-cutting the whole row at once. Once the slide settles past
// the middle copy, we snap back into it with the transition off (see
// handleTransitionEnd) — invisible to the eye since every copy is identical.
const TRACK = [...PHOTOS, ...PHOTOS, ...PHOTOS];

export default function FollowCarousel() {
  const [index, setIndex] = useState(TOTAL);
  const [animate, setAnimate] = useState(true);

  const prev = () => {
    setAnimate(true);
    setIndex((i) => i - 1);
  };
  const next = () => {
    setAnimate(true);
    setIndex((i) => i + 1);
  };

  function handleTransitionEnd() {
    if (index >= TOTAL * 2) {
      setAnimate(false);
      setIndex((i) => i - TOTAL);
    } else if (index < TOTAL) {
      setAnimate(false);
      setIndex((i) => i + TOTAL);
    }
  }

  const trackWidthPercent = (TRACK.length / VISIBLE) * 100;
  const offsetPercent = (index * 100) / TRACK.length;

  return (
    <div className="relative h-[320px] mt-8 overflow-hidden">
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/85 shadow-[0px_2px_4px_rgba(0,0,0,0.12)] rounded-[4px] w-10 h-20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L4 8l6 4" stroke="#151814" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${animate ? "transition-transform duration-500 ease-out" : ""}`}
        style={{ width: `${trackWidthPercent}%`, transform: `translateX(-${offsetPercent}%)` }}
      >
        {TRACK.map((src, i) => (
          <a
            key={i}
            href="https://www.instagram.com/checklocalfirstreno/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-full relative overflow-hidden flex-shrink-0"
            style={{ width: `${100 / TRACK.length}%` }}
          >
            <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
          </a>
        ))}
      </div>

      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/85 shadow-[0px_2px_4px_rgba(0,0,0,0.12)] rounded-[4px] w-10 h-20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l6 4-6 4" stroke="#151814" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
