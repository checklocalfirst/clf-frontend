import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Shirt,
  Sofa,
  Gift,
  Palette,
  Gem,
  Flower2,
  Leaf,
  Sparkles,
  Tag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import NearMeButton from "@/components/NearMeButton";
import {
  getBusinessCategories,
  getCategories,
  getEnrichedBusinesses,
  getListingPhotoUrl,
  isNewBusiness,
  searchBusinesses,
  type Category,
  type SearchResult,
  formatMiles,
} from "@/lib/directory";

export const metadata: Metadata = {
  title: "Browse Local Businesses",
  description:
    "Search and browse independently owned businesses in Reno, NV by category — clothing, home decor, gifts, art, jewelry, plants, sustainable goods, beauty, and more.",
  alternates: { canonical: "/search" },
};

// Keyed by the real category slugs from GET /categories — not display labels, since
// those are admin-editable. Anything not in this map (a newly added category) still
// renders, just with the DEFAULT_CATEGORY_ICON fallback below.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "clothing-and-apparel": Shirt,
  "home-decor-and-furniture": Sofa,
  "gifts-and-specialty": Gift,
  "art-and-design": Palette,
  "jewelry-and-accessories": Gem,
  "plants-and-garden": Flower2,
  "sustainable-living": Leaf,
  "beauty-and-wellness": Sparkles,
  "food-and-drink": UtensilsCrossed,
};
const DEFAULT_CATEGORY_ICON = Tag;

const COPY = {
  allBusinessesLabel: "All Businesses",
  browseByCategoryHeading: "BROWSE BY CATEGORY",
  nearYouHeading: "Businesses Near You",
  allBusinessesHeading: "All Businesses",
  resultsSuffix: "results",
  uncategorizedLabel: "Uncategorized",
  noDescriptionFallback: "No description yet.",
  relatedResultsLabel: "Related results",
  didYouMeanPrefix: "Did you mean",
  fallbackHeading: "No exact matches — you might like",
  correctedQueryPrefix: "Showing results for",
};

interface CategoryTile {
  label: string;
  Icon: LucideIcon;
  href: string;
}

function buildCategoryTiles(categories: Category[]): CategoryTile[] {
  return [
    { label: COPY.allBusinessesLabel, Icon: Store, href: "/search" },
    ...categories.map((c) => ({
      label: c.name,
      Icon: CATEGORY_ICONS[c.slug] ?? DEFAULT_CATEGORY_ICON,
      href: `/search?category=${encodeURIComponent(c.slug)}`,
    })),
  ];
}

const BR_TAG_PATTERN = /<br\s*\/?>/gi;

function stripBrTags(text: string): string {
  return text.replace(BR_TAG_PATTERN, " ").trim();
}

// Card previews show only the first sentence so a business with a long description
// doesn't stretch its card taller than the others — line-clamp then caps height in
// case that one sentence is itself long enough to wrap onto extra lines.
function firstSentence(text: string): string {
  const stripped = stripBrTags(text);
  const match = stripped.match(/^[^.!?]*[.!?]/);
  return match ? match[0].trim() : stripped;
}

const NEAR_ME_RADIUS_MILES = 30;

interface ResultCard {
  name: string;
  category: string;
  location: string;
  description: string;
  photo?: string;
  isNew: boolean;
  href: string;
  distanceMiles?: number;
  addressLabel?: string;
}

interface SearchView {
  cards: ResultCard[];
  // match_quality "partial" results, shown under a "Related results" divider
  relatedCards: ResultCard[];
  // Only when a search with input came back empty
  fallback?: { didYouMean: string | null; cards: ResultCard[] };
  // Set when a text search was auto-corrected (e.g. "blankit" → "blanket")
  correctedQuery?: string;
}

async function toResultCards(results: SearchResult[]): Promise<ResultCard[]> {
  // Business's own category badges, not the matched service's category — those can
  // differ, and business_categories is what the category filter actually uses.
  const [photos, categoryLists] = await Promise.all([
    Promise.all(results.map(({ business }) => getListingPhotoUrl(business.slug))),
    Promise.all(results.map(({ business }) => getBusinessCategories(business.slug).catch(() => []))),
  ]);

  return results.map(({ business, bestMatch, distance_miles }, i) => ({
    name: business.name,
    category: categoryLists[i][0]?.name ?? COPY.uncategorizedLabel,
    location: `${business.city}, ${business.state}`,
    description: business.description ?? bestMatch.name,
    photo: photos[i],
    isNew: isNewBusiness(business.created_at),
    href: `/businesses/${business.slug}`,
    distanceMiles: distance_miles,
    addressLabel: business.address_label?.trim() || undefined,
  }));
}

function byDistance(a: ResultCard, b: ResultCard): number {
  return (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity);
}

async function getSearchView(
  query: string,
  category: string,
  coords?: { lat: number; lng: number }
): Promise<SearchView> {
  // Distance filtering only exists on /search, so a location fix routes through the
  // same path as a text/category search, even with neither of those actually set.
  if (query || category || coords) {
    const { data: results, fallback, corrected_query } = await searchBusinesses(
      query,
      category,
      undefined,
      coords ? { ...coords, radiusMiles: NEAR_ME_RADIUS_MILES } : undefined
    );

    // Results arrive all_words-first. Only split when there's at least one full match to
    // sit above the divider — if every result is partial, a divider on top says nothing.
    const firstPartial = results.findIndex((r) => r.match_quality === "partial");
    const splitAt = firstPartial > 0 ? firstPartial : results.length;

    const [cards, relatedCards, fallbackCards] = await Promise.all([
      toResultCards(results.slice(0, splitAt)),
      toResultCards(results.slice(splitAt)),
      fallback ? toResultCards(fallback.businesses) : Promise.resolve([]),
    ]);

    // Closest-first is the whole point of "near me" — sort client-side on the page
    // we already have rather than trusting the backend's default ordering. Each group
    // sorts on its own so related results stay below the divider.
    if (coords) {
      cards.sort(byDistance);
      relatedCards.sort(byDistance);
    }

    return {
      cards,
      relatedCards,
      fallback: fallback && { didYouMean: fallback.did_you_mean, cards: fallbackCards },
      correctedQuery: corrected_query?.trim() || undefined,
    };
  }

  const businesses = await getEnrichedBusinesses();
  const photos = await Promise.all(businesses.map((b) => getListingPhotoUrl(b.slug)));
  const cards = businesses.map((b, i) => ({
    name: b.name,
    category: b.categoryNames[0] ?? COPY.uncategorizedLabel,
    location: `${b.city}, ${b.state}`,
    description: b.description ?? COPY.noDescriptionFallback,
    photo: photos[i],
    isNew: b.isNew,
    href: `/businesses/${b.slug}`,
    addressLabel: b.address_label?.trim() || undefined,
  }));
  return { cards, relatedCards: [] };
}

// Re-runs the current search with the suggested term, keeping any category/location filter.
function didYouMeanHref(term: string, category: string, coords?: { lat: number; lng: number }): string {
  const params = new URLSearchParams({ q: term });
  if (category) params.set("category", category);
  if (coords) {
    params.set("lat", String(coords.lat));
    params.set("lng", String(coords.lng));
  }
  return `/search?${params.toString()}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const raw = params.q;
  const query = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  const rawCategory = params.category;
  const category =
    typeof rawCategory === "string" ? rawCategory : Array.isArray(rawCategory) ? rawCategory[0] : "";

  const rawLat = params.lat;
  const rawLng = params.lng;
  const latStr = typeof rawLat === "string" ? rawLat : Array.isArray(rawLat) ? rawLat[0] : undefined;
  const lngStr = typeof rawLng === "string" ? rawLng : Array.isArray(rawLng) ? rawLng[0] : undefined;
  const lat = latStr !== undefined ? Number(latStr) : NaN;
  const lng = lngStr !== undefined ? Number(lngStr) : NaN;
  const coords = Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined;

  const [{ cards, relatedCards, fallback, correctedQuery }, categories] = await Promise.all([
    getSearchView(query, category, coords),
    getCategories(),
  ]);

  const resultCount = cards.length + relatedCards.length;
  const CATEGORIES = buildCategoryTiles(categories);

  return (
    <>
      <Header />

      <div className="bg-[#faf6e9]">
      <div className="max-w-[1280px] mx-auto w-full px-5 md:px-10">

      {/* ── Search Bar ── */}
      <div className="pt-5 md:pt-8">
        <SearchBar defaultValue={query} className="w-full md:max-w-[640px]" />
        <div className="mt-2">
          <NearMeButton active={!!coords} query={query} category={category} />
        </div>
      </div>

      {/* ── Browse By Category ── */}
      <section>
        {/* Desktop */}
        <div className="hidden md:flex flex-col pt-[56px] pb-[32px]">
          <h2 className="font-display font-bold text-[56px] text-[#423926] leading-none mb-3">
            {COPY.browseByCategoryHeading}
          </h2>
          <div className="h-px bg-[#dbe0d9] w-full mb-3" />
          <div className="flex gap-6 overflow-x-auto py-2 scrollbar-none">
            {CATEGORIES.map(({ label, Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-[10px] w-[150px] flex-shrink-0 group"
              >
                <Icon className="w-[60px] h-[60px] text-[#423926]" strokeWidth={1.5} />
                <span className="font-mono text-[15px] text-[#423926] text-center leading-tight group-hover:underline">
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <div className="h-px bg-[#dbe0d9] w-full mt-4" />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col pt-7 pb-4">
          <h2 className="font-display font-bold text-[28px] text-[#423926] mb-3 leading-none">
            {COPY.browseByCategoryHeading}
          </h2>
          <div className="h-px bg-[#dbe0d9] mb-4" />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(({ label, Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 flex-shrink-0 w-[88px] group"
              >
                <Icon className="w-9 h-9 text-[#423926]" strokeWidth={1.5} />
                <span className="font-mono text-[11px] text-[#423926] text-center leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <div className="h-px bg-[#dbe0d9] mt-4" />
        </div>
      </section>

      {/* ── Results Heading ── */}
      <div className="flex items-center pt-6 pb-2 md:pt-8 md:pb-3">
        <div className="flex items-center gap-3">
          {query ? (
            <h1 className="font-display font-bold text-[20px] md:text-[24px] text-[#423926] uppercase whitespace-nowrap">
              Results for &ldquo;{query}&rdquo;
            </h1>
          ) : coords ? (
            <h1 className="font-display font-bold text-[20px] md:text-[24px] text-[#423926] uppercase">
              {COPY.nearYouHeading}
            </h1>
          ) : (
            <h1 className="font-display font-bold text-[20px] md:text-[24px] text-[#423926] uppercase">
              {COPY.allBusinessesHeading}
            </h1>
          )}
          <div className="bg-[#c9d2cf] rounded-full px-[10px] py-[5px]">
            <span className="font-mono font-bold text-[11px] md:text-[13px] text-[#423926] uppercase whitespace-nowrap">
              {resultCount} {COPY.resultsSuffix}
            </span>
          </div>
        </div>
      </div>

      {correctedQuery && (
        <p className="font-mono text-[12px] md:text-[13px] text-[#b7a78c] pb-3 md:pb-4">
          {COPY.correctedQueryPrefix} <strong className="font-bold text-[#423926]">{correctedQuery}</strong>
        </p>
      )}

      {/* ── Business Grid + List ── */}
      <section className="pb-8 md:pb-12">
        <ResultsBlock cards={cards} />

        {relatedCards.length > 0 && (
          <>
            <div className="flex items-center gap-3 pt-4 pb-4 md:pt-6">
              <span className="font-mono font-bold text-[12px] md:text-[13px] text-[#b7a78c] uppercase whitespace-nowrap">
                {COPY.relatedResultsLabel}
              </span>
              <div className="h-px bg-[#dbe0d9] flex-1" />
            </div>
            <ResultsBlock cards={relatedCards} />
          </>
        )}

        {fallback && (
          <div className="flex flex-col gap-4 md:gap-6">
            {fallback.didYouMean && (
              <p className="font-mono text-[14px] md:text-[16px] text-[#423926]">
                {COPY.didYouMeanPrefix}{" "}
                <Link
                  href={didYouMeanHref(fallback.didYouMean, category, coords)}
                  className="font-bold underline hover:text-[#2c4a34] transition-colors"
                >
                  {fallback.didYouMean}
                </Link>
                ?
              </p>
            )}
            {fallback.cards.length > 0 && (
              <>
                <h2 className="font-display font-bold text-[18px] md:text-[22px] text-[#423926] uppercase">
                  {COPY.fallbackHeading}
                </h2>
                <ResultsBlock cards={fallback.cards} />
              </>
            )}
          </div>
        )}
      </section>

      </div>{/* max-w container */}
      </div>{/* bg wrapper */}

      <Footer />
    </>
  );
}

// First three results as large cards, the rest as a compact list. Shared by the main
// results, the "Related results" group and the no-match fallback.
function ResultsBlock({ cards }: { cards: ResultCard[] }) {
  const grid = cards.slice(0, 3);
  const list = cards.slice(3);

  return (
    <>
      {/* ── DESKTOP: 3-column grid cards ── */}
      <div className="hidden md:flex gap-6 mb-6">
        {grid.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            // Capped at a third of the row so 1–2 results don't stretch into giant square photos.
            className="flex-1 max-w-[calc((100%-48px)/3)] flex flex-col rounded-[16px] border border-[#dbe0d9] overflow-hidden bg-[#faf6e9] hover:shadow-md transition-shadow"
          >
            {/* Photo */}
            <div className="relative aspect-square w-full bg-[#c9d2cf] flex-shrink-0 rounded-t-[16px] overflow-hidden">
              {card.photo && <Image src={card.photo} alt={card.name} fill sizes="360px" className="object-cover" />}
              {card.isNew && (
                <div className="absolute top-[14px] left-[14px] bg-[#2c4a34] px-[10px] py-[5px] rounded-[4px]">
                  <span className="font-mono font-semibold text-[11px] text-white uppercase">
                    NEWLY ADDED
                  </span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-[10px] p-6">
              <div className="bg-[#c9d2cf] self-start px-3 py-[5px] rounded-full">
                <span className="font-mono font-semibold text-[12px] text-[#423926] uppercase">
                  {card.category}
                </span>
              </div>
              <p className="font-display font-bold text-[20px] text-[#423926] uppercase underline leading-tight">
                {card.name}
              </p>
              {card.addressLabel && (
                <p className="font-mono font-semibold text-[13px] text-[#423926] -mb-[6px]">{card.addressLabel}</p>
              )}
              <p className="font-mono text-[13px] text-[#b7a78c]">
                {card.location}
                {card.distanceMiles != null && ` · ${formatMiles(card.distanceMiles)}`}
              </p>
              <p className="font-mono text-[14px] text-[#423926] leading-snug line-clamp-2">
                {firstSentence(card.description)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── MOBILE: stacked full-width cards ── */}
      <div className="md:hidden flex flex-col gap-4 mb-4">
        {grid.map((card) => (
          <Link
            key={card.name}
            href={card.href}
            className="flex flex-col rounded-[12px] border border-[#dbe0d9] overflow-hidden bg-[#faf6e9]"
          >
            {/* Photo */}
            <div className="relative aspect-square w-full bg-[#c9d2cf] overflow-hidden">
              {card.photo && <Image src={card.photo} alt={card.name} fill sizes="100vw" className="object-cover" />}
              {card.isNew && (
                <div className="absolute top-3 left-3 bg-[#2c4a34] px-2 py-1 rounded-[4px]">
                  <span className="font-mono font-semibold text-[10px] text-white uppercase">
                    NEWLY ADDED
                  </span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-2 p-4">
              <div className="bg-[#c9d2cf] self-start px-3 py-1 rounded-full">
                <span className="font-mono font-semibold text-[11px] text-[#423926] uppercase">
                  {card.category}
                </span>
              </div>
              <p className="font-display font-bold text-[16px] text-[#423926] uppercase underline leading-tight">
                {card.name}
              </p>
              {card.addressLabel && (
                <p className="font-mono font-semibold text-[12px] text-[#423926] -mb-[4px]">{card.addressLabel}</p>
              )}
              <p className="font-mono text-[12px] text-[#b7a78c]">
                {card.location}
                {card.distanceMiles != null && ` · ${formatMiles(card.distanceMiles)}`}
              </p>
              <p className="font-mono text-[13px] text-[#423926] leading-snug line-clamp-2">
                {firstSentence(card.description)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── List Items (desktop + mobile) ── */}
      <div className="flex flex-col">
        {list.map((item, i) => (
          <div key={item.name}>
            <Link
              href={item.href}
              className="flex gap-4 items-center py-3 md:py-[12px] group"
            >
              {/* Thumbnail */}
              <div className="relative w-[52px] h-[52px] md:w-[72px] md:h-[72px] flex-shrink-0 rounded-[8px] md:rounded-[12px] border border-[#dbe0d9] overflow-hidden bg-[#c9d2cf]">
                {item.photo && <Image src={item.photo} alt={item.name} fill sizes="72px" className="object-cover" />}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-[5px] min-w-0">
                {/* Name + Location */}
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-bold text-[15px] md:text-[18px] text-[#423926] uppercase underline leading-none truncate group-hover:text-[#2c4a34] transition-colors">
                    {item.name}
                  </p>
                  <p className="font-mono text-[12px] md:text-[13px] text-[#b7a78c] whitespace-nowrap flex-shrink-0">
                    {item.location}
                    {item.distanceMiles != null && ` · ${formatMiles(item.distanceMiles)}`}
                  </p>
                </div>
                {item.addressLabel && (
                  <p className="font-mono font-semibold text-[12px] md:text-[13px] text-[#423926] truncate">
                    {item.addressLabel}
                  </p>
                )}

                {/* Category tag */}
                <div className="bg-[#c9d2cf] self-start px-3 py-[4px] rounded-full">
                  <span className="font-mono font-bold text-[11px] md:text-[13px] text-[#423926] uppercase whitespace-nowrap">
                    {item.category}
                  </span>
                </div>

                {/* Description — hidden on mobile to keep list compact */}
                <p className="hidden md:block font-display font-bold text-[14px] text-[#423926] leading-snug line-clamp-2">
                  {firstSentence(item.description)}
                </p>
              </div>
            </Link>

            {/* Divider (skip after last) */}
            {i < list.length - 1 && (
              <div className="h-px bg-[#dbe0d9] w-full" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
