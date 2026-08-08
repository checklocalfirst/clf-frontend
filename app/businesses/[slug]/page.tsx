import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import TrackedLink from "@/components/TrackedLink";
import DiscountRedeemButton from "@/components/DiscountRedeemButton";
import { getBusinessBySlug, getBusinessPhotos, trackBusinessEvent } from "@/lib/directory";
import { getPublicDiscounts } from "@/lib/business-dashboard";
import { ApiError } from "@/lib/api";
import { getSiteUrl } from "@/lib/site";

// Figma assets — replace with local /public paths when available
const HERO_IMG = "https://www.figma.com/api/mcp/asset/bd56b993-c2dd-4af0-b36e-bfe6f39a6b28";
const OWNER_IMG = "https://www.figma.com/api/mcp/asset/a9b5f067-3110-41a8-829f-d20441fca1ce";
const PILOT_BADGE_IMG = "https://www.figma.com/api/mcp/asset/c74691d5-b634-4596-a6bd-48d2a03b099a";

// Next automatically dedupes identical `fetch()` calls within one render pass, so this
// doesn't cost a second network round-trip on top of the page component's own fetch below.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const business = await getBusinessBySlug(slug);
    const photos = await getBusinessPhotos(slug).catch(() => []);
    const listingPhoto = photos
      .filter((p) => p.approved)
      .sort((a, b) => a.display_order - b.display_order)
      .find((p) => p.photo_type === "listing");

    const description =
      business.description?.trim() ||
      `${business.name} in ${business.city}, ${business.state} — find hours, contact info, and more on Check Local First.`;

    return {
      title: business.name,
      description,
      alternates: { canonical: `/businesses/${business.slug}` },
      openGraph: {
        title: business.name,
        description,
        type: "website",
        images: listingPhoto ? [{ url: listingPhoto.photo_url }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: business.name,
        description,
      },
    };
  } catch {
    // Not found / API error — let the page component's own notFound() handle it.
    return {};
  }
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let business;
  try {
    business = await getBusinessBySlug(slug);
  } catch (err) {
    // The backend doesn't cleanly 404 an unknown slug — a missing row surfaces as a
    // 500 with Supabase's raw `.single()` error instead. Treat that the same as a 404.
    const isMissing =
      err instanceof ApiError &&
      (err.status === 404 || err.message.includes("Cannot coerce the result to a single JSON object"));
    if (isMissing) notFound();
    throw err;
  }

  await trackBusinessEvent(slug, "page_view");

  const discounts = await getPublicDiscounts(slug).catch(() => []);
  const activeDiscount = discounts[0] ?? null;

  const photos = await getBusinessPhotos(slug).catch(() => []);
  const approvedPhotos = photos
    .filter((p) => p.approved)
    .sort((a, b) => a.display_order - b.display_order);
  const listingPhoto = approvedPhotos.find((p) => p.photo_type === "listing");
  const ownerPhoto = approvedPhotos.find((p) => p.photo_type === "owner");
  const timelinePhotos = approvedPhotos.filter((p) => p.photo_type === "timeline");
  const heroPhotoUrl = listingPhoto?.photo_url ?? HERO_IMG;
  const ownerPhotoUrl = ownerPhoto?.photo_url ?? OWNER_IMG;

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description ?? undefined,
    url: `${getSiteUrl()}/businesses/${business.slug}`,
    telephone: business.phone,
    email: business.email,
    image: listingPhoto?.photo_url ?? heroPhotoUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip,
      addressCountry: "US",
    },
    ...(business.website_url ? { sameAs: [business.website_url] } : {}),
  };

  return (
    <main className="bg-[#faf6e9]">
      {/* Escape `<` so a business name/description can't break out of the script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />

      {/* ── Search Row ── */}
      <div className="bg-[#faf6e9] border-b border-[#dbe0d9]">
        <div className="hidden md:flex items-center justify-center h-[112px] px-[280px]">
          <SearchBar className="w-[880px]" />
        </div>
        <div className="md:hidden flex items-center h-[72px] px-[16px]">
          <SearchBar className="w-full" />
        </div>
      </div>

      {/* ── Discount Banner ── */}
      {activeDiscount && (
      <>
      {/* Desktop: animated ticker */}
      <div className="hidden md:block relative bg-[#bc6239] h-[56px] overflow-hidden">
        <div
          className="absolute top-[15px] flex animate-marquee"
          style={{ width: "max-content" }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="flex items-center shrink-0" style={{ width: "420px" }}>
              <span className="font-display font-bold text-[18px] text-white whitespace-nowrap">
                {activeDiscount.description}
              </span>
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-white ml-[12px]" />
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-[70px] bg-gradient-to-r from-[#bc6239] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[222px] bg-gradient-to-l from-[#bc6239] to-transparent z-10 pointer-events-none" />
        <DiscountRedeemButton
          slug={business.slug}
          discountId={activeDiscount.id}
          className="absolute right-[22px] top-[11px] z-20 bg-[#faf6e9] rounded-full h-[34px] flex items-center px-[16px] cursor-pointer hover:opacity-90 transition-opacity"
          textClassName="font-display font-bold text-[12px] text-[#bc6239] whitespace-nowrap"
        />
      </div>
      {/* Mobile: static bar */}
      <div className="md:hidden bg-[#253022] h-[40px] flex items-center justify-center gap-[8px] px-4">
        <p className="font-display font-bold text-[12px] text-[#faf6e9] text-center whitespace-nowrap overflow-hidden text-ellipsis">
          {activeDiscount.description}
        </p>
        <DiscountRedeemButton
          slug={business.slug}
          discountId={activeDiscount.id}
          className="flex-shrink-0 bg-[#faf6e9] rounded-full h-[26px] flex items-center px-[10px] cursor-pointer hover:opacity-90 transition-opacity"
          textClassName="font-display font-bold text-[10px] text-[#253022] whitespace-nowrap"
        />
      </div>
      </>
      )}

      {/* ── Desktop: Business Info Bar ── */}
      <div className="hidden md:flex items-center justify-between bg-[#faf6e9] min-h-[275px] px-[64px] pt-[48px] pb-[32px] gap-[32px]">
        <div className="flex flex-col gap-[10px] min-w-0">
          <Link
            href="/search"
            className="font-body text-[20px] text-[rgba(66,57,38,0.8)] whitespace-nowrap hover:opacity-70 transition-opacity"
          >
            ← All Businesses
          </Link>
          <h1 className="font-display font-bold text-[64px] text-[#423926] tracking-[-0.32px] leading-none">
            {business.name.toUpperCase()}
          </h1>
          <TrackedLink
            slug={business.slug}
            event="address_click"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-body text-[20px] text-[rgba(66,57,38,0.8)] max-w-[500px] hover:opacity-70 transition-opacity"
          >
            {fullAddress}
          </TrackedLink>
        </div>

        <div className="flex items-center gap-[16px] flex-shrink-0">
          <TrackedLink
            slug={business.slug}
            event="call_click"
            href={`tel:+1${phoneDigits}`}
            className="bg-[#423926] text-[#f3f5e7] font-display font-bold text-[20px] tracking-[1px] px-[28px] py-[13px] rounded-full whitespace-nowrap hover:bg-[#2c4a34] transition-colors"
          >
            Call Now
          </TrackedLink>
          {business.website_url && (
            <TrackedLink
              slug={business.slug}
              event="website_click"
              href={business.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative bg-[#bc6239] h-[52px] w-[199px] rounded-[8px] flex items-center px-[24px] hover:opacity-90 transition-opacity overflow-hidden"
            >
              <span className="font-display font-bold text-[16px] text-white">VISIT WEBSITE</span>
              <svg
                className="absolute right-[24px]"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 13L13 3M13 3H7M13 3V9"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </TrackedLink>
          )}
          <div className="flex items-center gap-[12px]">
            {business.instagram_url && (
              <TrackedLink
                slug={business.slug}
                event="instagram_click"
                href={business.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-[#2c4a34] w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-[#253022] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="3" stroke="white" strokeWidth="1.2" />
                  <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="1.2" />
                  <circle cx="11.5" cy="4.5" r="0.75" fill="white" />
                </svg>
              </TrackedLink>
            )}
            {business.facebook_url && (
              <TrackedLink
                slug={business.slug}
                event="facebook_click"
                href={business.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-[#2c4a34] w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-[#253022] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 2H8.5C7.4 2 7 2.9 7 4V6H5V8.5H7V14H9.5V8.5H11.5L12 6H9.5V4.5C9.5 3.9 9.7 3.5 10 3.5H12V2H10Z"
                    fill="white"
                  />
                </svg>
              </TrackedLink>
            )}
            {business.yelp_url && (
              <TrackedLink
                slug={business.slug}
                event="yelp_click"
                href={business.yelp_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yelp"
                className="bg-[#2c4a34] w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-[#253022] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L9.8 5.6L14.5 5.9L10.9 9L12 13.6L8 11.1L4 13.6L5.1 9L1.5 5.9L6.2 5.6L8 1Z"
                    fill="white"
                  />
                </svg>
              </TrackedLink>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile: Business Info ── */}
      <div className="md:hidden bg-[#faf6e9] px-[16px]">
        <Link
          href="/search"
          className="block font-body text-[20px] text-[rgba(66,57,38,0.8)] mt-[24px] hover:opacity-70 transition-opacity"
        >
          ← All Businesses
        </Link>
        <h1 className="font-display font-bold text-[30px] text-[#423926] tracking-[-0.15px] leading-tight mt-[12px]">
          {business.name.toUpperCase()}
        </h1>
        <TrackedLink
          slug={business.slug}
          event="address_click"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-body text-[20px] text-[rgba(66,57,38,0.8)] mt-[16px] hover:opacity-70 transition-opacity"
        >
          {fullAddress}
        </TrackedLink>
        <TrackedLink
          slug={business.slug}
          event="call_click"
          href={`tel:+1${phoneDigits}`}
          className="flex items-center justify-center w-full bg-[#423926] text-[#f3f5e7] font-display font-bold text-[20px] tracking-[1px] py-[13px] rounded-full mt-[24px] hover:bg-[#2c4a34] transition-colors"
        >
          Call Now
        </TrackedLink>
        {business.website_url && (
          <TrackedLink
            slug={business.slug}
            event="website_click"
            href={business.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center w-full bg-[#bc6239] h-[52px] rounded-[8px] mt-[16px] px-[24px] hover:opacity-90 transition-opacity"
          >
            <span className="font-display font-bold text-[16px] text-white">VISIT WEBSITE</span>
            <svg
              className="absolute right-[24px]"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 13L13 3M13 3H7M13 3V9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </TrackedLink>
        )}
      </div>

      {/* ── Mobile: Hero Photo + Pilot Badge ── */}
      <div className="md:hidden relative mx-[16px] mt-[24px] h-[240px] bg-[#c96f47] rounded-[12px] overflow-hidden">
        <Image src={heroPhotoUrl} alt={`${business.name} storefront`} fill priority sizes="100vw" className="object-cover" />
        {business.pilot_business && (
          <div className="absolute z-10 bottom-[8px] right-[8px] w-[96px] h-[82px]">
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

      {/* ── Desktop: Hero Photo + About + Pilot Badge ── */}
      <div className="hidden md:block relative">
        {/* Hero Photo */}
        <div className="relative h-[700px] bg-[#b7a78c] overflow-hidden">
          <Image
            src={heroPhotoUrl}
            alt={`${business.name} storefront`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <p className="absolute bottom-0 w-full text-center font-display text-[14px] text-[rgba(66,57,38,0.8)] tracking-[0.56px] py-[8px] bg-gradient-to-t from-[#b7a78c]/40 to-transparent">
            {business.name.toUpperCase()} — STOREFRONT PHOTO
          </p>
        </div>

        {/* About Section */}
        <div className="bg-[#faf6e9] px-[64px] pt-[32px] pb-[48px]">
          <h2 className="font-display font-bold text-[64px] text-[#423926] tracking-[0.64px] leading-none">
            ABOUT
          </h2>
          <p className="font-body text-[20px] text-[rgba(66,57,38,0.8)] leading-[1.6] mt-[16px] max-w-[760px]">
            {business.description ?? "No description provided yet."}
          </p>
        </div>

        {/* Pilot Business Badge */}
        {business.pilot_business && (
        <div
          className="absolute z-10"
          style={{ top: "569px", right: "40px", width: "292px", height: "248px" }}
        >
          <Image
            src={PILOT_BADGE_IMG}
            alt="Pilot Business"
            fill
            sizes="292px"
            className="object-contain"
            style={{ transform: "rotate(2.97deg)" }}
          />
        </div>
        )}
      </div>

      {/* ── Mobile: About Section ── */}
      <div className="md:hidden px-[16px] pt-[32px] pb-[32px]">
        <h2 className="font-display font-bold text-[26px] text-[#423926] tracking-[0.26px] leading-none">
          ABOUT
        </h2>
        <p className="font-body text-[20px] text-[rgba(66,57,38,0.8)] leading-[1.6] mt-[20px]">
          {business.description ?? "No description provided yet."}
        </p>
      </div>

      {/* ── Desktop: Meet the Owner ── */}
      {showOwnerSection && (
      <div className="hidden md:block bg-[#9ca889] py-[67px]">
        <div className="flex items-start pl-[139px] pr-[105px] gap-[253px]">
          {/* Polaroid — sits 31px lower than the text to match Figma */}
          <div className="relative flex-shrink-0 mt-[31px]">
            {/* Tape accent — offset relative to polaroid top-left */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: "-95px", top: "-50px", width: "95px", height: "62px" }}
            >
              <div
                className="bg-[rgba(156,168,137,0.88)] h-[30px] w-[90px]"
                style={{ transform: "rotate(-22deg)" }}
              />
            </div>

            {/* Polaroid card */}
            <div className="relative bg-[#faf6e9] rounded-[4px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.25)] w-[380px] h-[430px]">
              <div
                className="absolute rounded-[2px] overflow-hidden"
                style={{ top: "33px", left: "24px", right: "26px", height: "307px" }}
              >
                <Image src={ownerPhotoUrl} alt="Owner" fill sizes="330px" className="object-cover" />
              </div>
              <p
                className="absolute font-display text-[14px] text-[#423926] tracking-[0.56px] whitespace-nowrap"
                style={{ left: "141px", top: "380px" }}
              >
                MEET BLANK
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-[64px] text-[#f3f5e7] tracking-[0.64px] leading-none">
              MEET THE OWNER
            </h2>
            <p className="font-body text-[20px] text-[#f3f5e7] leading-[1.6] mt-[56px]">
              {business.about_owner}
            </p>
          </div>
        </div>
      </div>
      )}

      {/* ── Mobile: Meet the Owner ── */}
      {showOwnerSection && (
      <div className="md:hidden px-[16px] pb-[32px]">
        <h2 className="font-display font-bold text-[26px] text-[#253022] tracking-[0.26px] leading-none">
          MEET THE OWNER
        </h2>
        <div className="relative mt-[16px] h-[260px] bg-[#c9d2cf] rounded-[12px] overflow-hidden">
          <Image src={ownerPhotoUrl} alt="Owner" fill sizes="100vw" className="object-cover" />
        </div>
        <p className="font-body text-[20px] text-[#666b61] leading-[1.6] mt-[16px]">
          {business.about_owner}
        </p>
      </div>
      )}

      {/* ── Desktop: How They Started Timeline ── */}
      {showTimeline && (
      <div className="hidden md:flex flex-col gap-[36px] bg-[#423926] px-[80px] py-[96px]">
        <h2 className="font-display font-bold text-[64px] text-[#faf6e9] tracking-[0.64px] leading-none">
          HOW THEY STARTED
        </h2>

        <div className="relative flex gap-[100px] items-start">
          {/* Connecting timeline line at dot level */}
          <div
            className="absolute left-0 right-0 h-[2px] bg-[rgba(250,246,233,0.25)]"
            style={{ top: "284px" }}
          />

          {timelineEntries.map(({ year, img, desc }, i) => (
            <div key={i} className="flex flex-col gap-[24px] items-center flex-1 min-w-0">
              {/* Polaroid mount — only when this slot has a photo */}
              {img && (
                <div className="bg-[#faf6e9] rounded-[4px] shadow-[0px_8px_8px_rgba(0,0,0,0.25)] p-[12px] pb-[24px] w-[240px] h-[240px] flex-shrink-0">
                  <div className="relative w-full h-full rounded-[2px] overflow-hidden">
                    <Image src={img} alt={year} fill sizes="240px" className="object-cover" />
                  </div>
                </div>
              )}

              {/* Dot */}
              <div className="flex items-center justify-center h-[40px] w-full relative z-10">
                <div className="w-[16px] h-[16px] rounded-full bg-[#faf6e9]" />
              </div>

              {/* Year + description */}
              <div className="flex flex-col gap-[16px] w-full">
                <p className="font-display font-bold text-[48px] text-[#c9d2cf] tracking-[-0.5px] leading-none">
                  {year}
                </p>
                <p className="font-body text-[20px] text-[rgba(250,246,233,0.7)] leading-[1.6]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Visit Us CTA */}
        <div className="flex items-center justify-center pt-[24px]">
          <a
            href="#"
            className="bg-[#faf6e9] rounded-full h-[78px] w-[246px] flex items-center justify-center gap-[12px] hover:bg-white transition-colors"
          >
            <span className="font-display font-bold text-[32px] text-[#423926] tracking-[1px]">
              VISIT US
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="#423926"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      )}

      {/* ── Mobile: How They Started Timeline ── */}
      {showTimeline && (
      <div className="md:hidden flex flex-col gap-[32px] bg-[#423926] px-[16px] py-[48px]">
        <h2 className="font-display font-bold text-[26px] text-[#faf6e9] tracking-[0.26px] leading-none">
          HOW THEY STARTED
        </h2>

        <div className="flex flex-col gap-[32px]">
          {timelineEntries.map(({ year, img, desc }, i) => (
            <div key={i} className="flex flex-col gap-[16px]">
              {/* Polaroid mount — only when this slot has a photo */}
              {img && (
                <div className="bg-[#faf6e9] rounded-[4px] shadow-[0px_8px_8px_rgba(0,0,0,0.25)] p-[10px] pb-[20px] w-[180px] h-[180px] mx-auto">
                  <div className="relative w-full h-full rounded-[2px] overflow-hidden">
                    <Image src={img} alt={year} fill sizes="180px" className="object-cover" />
                  </div>
                </div>
              )}

              {/* Year + description */}
              <div className="flex flex-col gap-[8px] text-center">
                <p className="font-display font-bold text-[32px] text-[#c9d2cf] tracking-[-0.5px] leading-none">
                  {year}
                </p>
                <p className="font-body text-[15px] text-[rgba(250,246,233,0.7)] leading-[1.6]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Visit Us CTA */}
        <div className="flex items-center justify-center pt-[8px]">
          <a
            href="#"
            className="bg-[#faf6e9] rounded-full h-[56px] w-[200px] flex items-center justify-center gap-[10px] hover:bg-white transition-colors"
          >
            <span className="font-display font-bold text-[18px] text-[#423926] tracking-[1px]">
              VISIT US
            </span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="#423926"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      )}

      {/* ── Desktop Footer ── */}
      <footer className="hidden md:block bg-[#9ca889] px-[80px] pt-[80px] pb-[40px]">
        <div className="flex items-start justify-between">
          <div className="w-[360px]">
            <p className="font-display font-bold text-[20px] text-white uppercase">
              Check Local First
            </p>
          </div>
          <div className="flex gap-[80px]">
            <div className="flex flex-col gap-[16px] w-[160px]">
              <p className="font-display font-bold text-[20px] text-white uppercase opacity-50">
                Explore
              </p>
              <div className="flex flex-col gap-[10px]">
                {[
                  { label: "Home", href: "/" },
                  { label: "Search", href: "/search" },
                  { label: "About", href: "/about" },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="font-display font-bold text-[20px] text-white uppercase whitespace-nowrap hover:opacity-80 transition-opacity"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[16px] w-[160px]">
              <p className="font-display font-bold text-[20px] text-white uppercase opacity-50">
                For Businesses
              </p>
              <div className="flex flex-col gap-[10px]">
                <Link href="/signup" className="font-display font-bold text-[20px] text-white uppercase whitespace-nowrap hover:opacity-80 transition-opacity">
                  Add Your Business
                </Link>
                <Link href="/login" className="font-display font-bold text-[20px] text-white uppercase whitespace-nowrap hover:opacity-80 transition-opacity">
                  Business Login
                </Link>
                <Link href="/dashboard" className="font-display font-bold text-[20px] text-white uppercase whitespace-nowrap hover:opacity-80 transition-opacity">Dashboard</Link>
              </div>
            </div>
            <div className="flex flex-col gap-[16px] w-[160px]">
              <p className="font-display font-bold text-[20px] text-white uppercase opacity-50">
                Other
              </p>
              <div className="flex flex-col gap-[10px]">
                {["Privacy Policy", "Terms of Service"].map((l) => (
                  <p key={l} className="font-display font-bold text-[20px] text-white uppercase whitespace-nowrap">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#41523d] mt-[64px] pt-[24px]">
          <p className="font-mono font-normal text-[20px] text-white opacity-40">
            © 2026 Check Local First. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Mobile Footer ── */}
      <footer className="md:hidden bg-[#9ca889] px-[24px] pt-[40px] pb-[32px]">
        <p className="font-display font-bold text-[16px] text-[#faf6e9]">CHECK LOCAL FIRST</p>

        <div className="mt-[40px]">
          <p className="font-display font-bold text-[13px] text-[#faf6e9]">EXPLORE</p>
          <div className="flex flex-col gap-[16px] mt-[16px]">
            {["Home", "Search", "About"].map((l) => (
              <p key={l} className="font-display text-[14px] text-[#faf6e9]">
                {l}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-[40px]">
          <p className="font-display font-bold text-[13px] text-[#faf6e9]">FOR BUSINESSES</p>
          <div className="flex flex-col gap-[16px] mt-[16px]">
            <Link href="/signup" className="font-display text-[14px] text-[#faf6e9] hover:opacity-80 transition-opacity">
              Add Your Business
            </Link>
            <Link href="/login" className="font-display text-[14px] text-[#faf6e9] hover:opacity-80 transition-opacity">
              Business Login
            </Link>
            <Link href="/dashboard" className="font-display text-[14px] text-[#faf6e9] hover:opacity-80 transition-opacity">Dashboard</Link>
          </div>
        </div>

        <div className="mt-[40px]">
          <p className="font-display font-bold text-[13px] text-[#faf6e9]">OTHER</p>
          <div className="flex flex-col gap-[16px] mt-[16px]">
            {["Privacy Policy", "Terms of Service"].map((l) => (
              <p key={l} className="font-display text-[14px] text-[#faf6e9]">
                {l}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-[64px] border-t border-[rgba(250,246,233,0.3)] pt-[24px]">
          <p className="font-display text-[14px] text-[#faf6e9]">© 2026 Check Local First.</p>
        </div>
      </footer>
    </main>
  );
}
