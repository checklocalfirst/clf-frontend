"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/dashboard/ToastProvider";

function buildHref(query: string, category: string, coords?: { lat: number; lng: number }) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (coords) {
    params.set("lat", String(coords.lat));
    params.set("lng", String(coords.lng));
  }
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

export default function NearMeButton({
  active,
  query,
  category,
}: {
  active: boolean;
  query: string;
  category: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    // Already active — clicking again turns it off rather than re-requesting location.
    if (active) {
      router.push(buildHref(query, category));
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Location isn't available in this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        router.push(
          buildHref(query, category, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        );
      },
      (error) => {
        setLoading(false);
        toast.error(
          error.code === error.PERMISSION_DENIED
            ? "Location access was denied — enable it in your browser settings to use Near Me."
            : "Couldn't get your location. Please try again."
        );
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60 * 1000 }
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-pressed={active}
      className={`px-3 h-7 rounded-full border font-mono text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
        active
          ? "bg-[#2c4a34] border-[#2c4a34] text-white"
          : "bg-white border-[#dbe0d9] text-[#423926] hover:border-[#2c4a34]"
      }`}
    >
      {loading ? "Locating…" : "Near Me"}
    </button>
  );
}
