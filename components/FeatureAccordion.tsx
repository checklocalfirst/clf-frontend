"use client";

import { useState } from "react";

interface Feature {
  label: string;
  description: string;
}

export default function FeatureAccordion({
  features,
  labelColor,
  descColor,
  dividerColor,
  plusColor,
}: {
  features: Feature[];
  labelColor: string;
  descColor: string;
  dividerColor: string;
  plusColor: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {features.map((f) => {
        const isOpen = open === f.label;
        return (
          <div key={f.label} className={`border-b ${dividerColor}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : f.label)}
              className="w-full flex items-center justify-between py-[14px] cursor-pointer text-left"
            >
              <span className={`font-body text-[15px] ${labelColor}`}>{f.label}</span>
              <span className={`font-body text-[18px] leading-none ${plusColor} transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {isOpen && (
              <p className={`font-body text-[13px] ${descColor} pb-[14px] leading-[1.6]`}>
                {f.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
