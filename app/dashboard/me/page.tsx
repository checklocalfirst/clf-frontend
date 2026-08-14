"use client";

import Image from "next/image";
import { useBusiness } from "@/components/dashboard/BusinessContext";
import { useApiResource } from "@/lib/useApiResource";
import { getMyPhotos, getMyDiscounts, type Discount } from "@/lib/business-dashboard";
import type { Photo } from "@/lib/directory";

const HERO_IMG = "/mainpage3.JPG";
const OWNER_IMG = "/people.JPG";
const PILOT_BADGE_IMG = "/newpilotlogo.png";

function isCurrentlyActive(d: Discount, now: Date): boolean {
  if (!d.active) return false;
  if (d.starts_at && new Date(d.starts_at) > now) return false;
  if (d.expires_at && new Date(d.expires_at) < now) return false;
  return true;
}

export default function MyListingPreviewPage() {
  const { business } = useBusiness();

  const { data: photos, loading: photosLoading } = useApiResource<Photo[]>(
    (token) => getMyPhotos(token, business.slug),
    [business.slug]
  );
  const { data: discounts, loading: discountsLoading } = useApiResource<Discount[]>(
    (token) => getMyDiscounts(token, business.slug),
    [business.slug]
  );

  const loading = photosLoading || discountsLoading;

  // Mirror what a customer actually sees: approved photos only, and the same
  // "currently active, in-window" rule the public discounts route applies.
  const approvedPhotos = (photos ?? []).filter((p) => p.approved).sort((a, b) => a.display_order - b.display_order);
  const listingPhoto = approvedPhotos.find((p) => p.photo_type === "listing");
  const ownerPhoto = approvedPhotos.find((p) => p.photo_type === "owner");
  const timelinePhotos = approvedPhotos.filter((p) => p.photo_type === "timeline");
  const heroPhotoUrl = listingPhoto?.photo_url ?? HERO_IMG;
  const ownerPhotoUrl = ownerPhoto?.photo_url ?? OWNER_IMG;

  const activeDiscount = (discounts ?? []).find((d) => isCurrentlyActive(d, new Date())) ?? null;

  const fullAddress = `${business.address}, ${business.city}, ${business.state} ${business.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const phoneDigits = business.phone.replace(/\D/g, "");

  const timelineEntries = (
    [
      { slot: 1 as const, year: business.timeline_year_1, desc: business.timeline_description_1 },
      { slot: 2 as const, year: business.timeline_year_2, desc: business.timeline_description_2 },
      { slot: 3 as const, year: business.timeline_year_3, desc: business.timeline_description_3 },
    ] satisfies { slot: 1 | 2 | 3; year: string | null; desc: string | null }[]
  )
    .filter((t): t is { slot: 1 | 2 | 3; year: string; desc: string } => !!t.year && !!t.desc)
    .map((t) => ({
      ...t,
      img: timelinePhotos.find((p) => p.timeline_slot === t.slot)?.photo_url,
    }));
  const showTimeline = business.business_tier === "premium" && timelineEntries.length > 0;
  const showOwnerSection = !!business.about_owner?.trim() && !!ownerPhoto;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-[24px] text-[#423926]">Preview My Listing</h2>
        <p className="font-body text-[13px] text-[#596155] mt-1">
          This is a private preview of what customers see on your public page — approved photos only, and only a
          currently active discount. Pending photos won&apos;t show here until an admin approves them.
        </p>
      </div>

      {business.status !== "approved" && (
        <div className="bg-[#faf6e9] border border-[#b7a78c] rounded-[12px] px-5 py-4">
          <p className="font-body text-[13px] text-[#423926]">
            Your listing isn&apos;t live yet (status: {business.status}), so this preview is the only way to see it
            until it&apos;s approved.
          </p>
        </div>
      )}

      {loading && <p className="font-body text-[14px] text-[#596155]">Loading preview…</p>}

      {!loading && (
        <div className="border border-[#dbe0d9] rounded-[16px] overflow-hidden">
          <div className="bg-[#faf6e9]">
            {/* ── Discount Banner ── */}
            {activeDiscount && (
              <div className="bg-[#bc6239] px-6 py-3 flex items-center justify-between gap-4">
                <span className="font-display font-bold text-[14px] text-white">{activeDiscount.description}</span>
                <span className="flex-shrink-0 bg-[#faf6e9] rounded-full h-[30px] flex items-center px-4">
                  <span className="font-display font-bold text-[11px] text-[#bc6239] whitespace-nowrap">
                    CODE: {activeDiscount.code}
                  </span>
                </span>
              </div>
            )}

            {/* ── Info Bar ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-6 md:px-10 pt-8 pb-6">
              <div className="flex flex-col gap-2 min-w-0">
                <h1 className="font-display font-bold text-[32px] md:text-[42px] text-[#423926] tracking-[-0.32px] leading-none">
                  {business.name.toUpperCase()}
                </h1>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[15px] text-[rgba(66,57,38,0.8)] hover:opacity-70 transition-opacity"
                >
                  {fullAddress}
                </a>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={`tel:+1${phoneDigits}`}
                  className="bg-[#423926] text-[#f3f5e7] font-display font-bold text-[13px] tracking-[1px] px-5 py-3 rounded-full whitespace-nowrap hover:bg-[#2c4a34] transition-colors"
                >
                  Call Now
                </a>
                {business.website_url && (
                  <a
                    href={business.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#bc6239] text-white font-display font-bold text-[13px] px-5 py-3 rounded-[8px] whitespace-nowrap hover:opacity-90 transition-opacity"
                  >
                    Visit Website
                  </a>
                )}
                <div className="flex items-center gap-2">
                  {business.instagram_url && (
                    <span
                      aria-label="Instagram"
                      className="bg-[#2c4a34] w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="2" width="12" height="12" rx="3" stroke="white" strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="1.2" />
                        <circle cx="11.5" cy="4.5" r="0.75" fill="white" />
                      </svg>
                    </span>
                  )}
                  {business.facebook_url && (
                    <span
                      aria-label="Facebook"
                      className="bg-[#2c4a34] w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M10 2H8.5C7.4 2 7 2.9 7 4V6H5V8.5H7V14H9.5V8.5H11.5L12 6H9.5V4.5C9.5 3.9 9.7 3.5 10 3.5H12V2H10Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  )}
                  {business.yelp_url && (
                    <span
                      aria-label="Yelp"
                      className="bg-[#2c4a34] w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 1L9.8 5.6L14.5 5.9L10.9 9L12 13.6L8 11.1L4 13.6L5.1 9L1.5 5.9L6.2 5.6L8 1Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Hero Photo ── */}
            <div className="relative h-[280px] md:h-[420px] bg-[#b7a78c] overflow-hidden">
              <Image src={heroPhotoUrl} alt={`${business.name} storefront`} fill sizes="100vw" className="object-cover" />
              {business.pilot_business && (
                <div className="absolute z-10 bottom-2 right-2 w-[64px] h-[54px] md:w-[96px] md:h-[82px]">
                  <Image
                    src={PILOT_BADGE_IMG}
                    alt="Pilot Business"
                    fill
                    sizes="96px"
                    className="object-contain"
                    style={{ transform: "rotate(2.97deg)" }}
                  />
                </div>
              )}
            </div>

            {/* ── About ── */}
            <div className="px-6 md:px-10 pt-8 pb-10">
              <h2 className="font-display font-bold text-[28px] md:text-[36px] text-[#423926] tracking-[0.28px] leading-none">
                ABOUT
              </h2>
              <p className="font-body text-[15px] text-[rgba(66,57,38,0.8)] leading-[1.6] mt-3 max-w-[640px]">
                {business.description ?? "No description provided yet."}
              </p>
            </div>
          </div>

          {/* ── Meet the Owner ── */}
          {showOwnerSection && (
            <div className="bg-[#9ca889] px-6 md:px-10 py-10 flex flex-col md:flex-row items-start gap-8 md:gap-16">
              <div className="relative flex-shrink-0 bg-[#faf6e9] rounded-[4px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.25)] w-full md:w-[220px] h-[240px] p-3">
                <div className="relative w-full h-[180px] rounded-[2px] overflow-hidden">
                  <Image src={ownerPhotoUrl} alt="Owner" fill sizes="220px" className="object-cover" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-[28px] md:text-[36px] text-[#f3f5e7] tracking-[0.28px] leading-none">
                  MEET THE OWNER
                </h2>
                <p className="font-body text-[15px] text-[#f3f5e7] leading-[1.6] mt-4">{business.about_owner}</p>
              </div>
            </div>
          )}

          {/* ── How They Started Timeline ── */}
          {showTimeline && (
            <div className="bg-[#423926] px-6 md:px-10 py-10">
              <h2 className="font-display font-bold text-[28px] md:text-[36px] text-[#faf6e9] tracking-[0.28px] leading-none mb-8">
                HOW THEY STARTED
              </h2>
              <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                {timelineEntries.map(({ year, img, desc }, i) => (
                  <div key={i} className="flex flex-col gap-3 flex-1 min-w-0">
                    {img && (
                      <div className="relative w-full h-[140px] rounded-[4px] overflow-hidden bg-[#faf6e9] p-2">
                        <div className="relative w-full h-full rounded-[2px] overflow-hidden">
                          <Image src={img} alt={year} fill sizes="240px" className="object-cover" />
                        </div>
                      </div>
                    )}
                    <p className="font-display font-bold text-[28px] text-[#c9d2cf] tracking-[-0.5px] leading-none">
                      {year}
                    </p>
                    <p className="font-body text-[14px] text-[rgba(250,246,233,0.7)] leading-[1.6]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
