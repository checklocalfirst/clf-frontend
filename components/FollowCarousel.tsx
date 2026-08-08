"use client";

import Image from "next/image";
import { useState } from "react";

const PHOTOS = [
  "/breadcompany.JPG",
  "/farmers1.JPG",
  "/modestmix.JPG",
  "/sasquatchsnacks.jpg",
];

const VISIBLE = 3;

export default function FollowCarousel() {
  const [start, setStart] = useState(0);
  const total = PHOTOS.length;

  const prev = () => setStart((s) => (s - 1 + total) % total);
  const next = () => setStart((s) => (s + 1) % total);

  const visible = Array.from({ length: VISIBLE }, (_, i) => PHOTOS[(start + i) % total]);

  return (
    <div className="relative h-[320px] mt-8 flex overflow-hidden">
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/85 shadow-[0px_2px_4px_rgba(0,0,0,0.12)] rounded-[4px] w-10 h-20 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L4 8l6 4" stroke="#151814" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {visible.map((src, i) => (
        <a
          key={`${start}-${i}`}
          href="https://www.instagram.com/checklocalfirstreno/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-full relative overflow-hidden"
        >
          <Image src={src} alt="" fill sizes="33vw" className="object-cover" />
        </a>
      ))}

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
