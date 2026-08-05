import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import {
  getCategories,
  getEnrichedBusinesses,
  getListingPhotoUrl,
  isNewBusiness,
  searchBusinesses,
} from "@/lib/directory";

// Category icon assets from Figma (expire in 7 days — replace with /public SVGs)
const ICON_FORK_KNIFE = "https://www.figma.com/api/mcp/asset/1d78dbba-5a49-4c0b-acf0-27729a6091d0";
const ICON_STOREFRONT = "https://www.figma.com/api/mcp/asset/6e1d77ea-c31e-4a21-af68-005f4fe4f3b1";
const ICON_FLOWER_VASE = "https://www.figma.com/api/mcp/asset/a365cd62-b543-4d44-9c94-17dc06671414";
const ICON_DUMBBELL = "https://www.figma.com/api/mcp/asset/6cfba0b6-2418-4582-bd48-3644366d5f5a";
const ICON_HELMET = "https://www.figma.com/api/mcp/asset/fe7186a4-6900-4026-ac9c-980a6678ad0c";
const ICON_CLAPPERBOARD = "https://www.figma.com/api/mcp/asset/f5dd878e-1522-4d85-96e1-fae8b7924c15";

const CATEGORIES = [
  { label: "All Businesses", icon: null, href: "/search" },
  { label: "Food & Drink", icon: ICON_FORK_KNIFE, href: "/search?category=food-drink" },
  { label: "Shop & Goods", icon: ICON_STOREFRONT, href: "/search?category=shop-goods" },
  { label: "Home & Garden", icon: ICON_FLOWER_VASE, href: "/search?category=home-garden" },
  { label: "Health & Beauty", icon: ICON_DUMBBELL, href: "/search?category=health-beauty" },
  { label: "Services", icon: ICON_HELMET, href: "/search?category=services" },
  { label: "Arts & Entertainment", icon: ICON_CLAPPERBOARD, href: "/search?category=arts-entertainment" },
];

interface ResultCard {
  name: string;
  category: string;
  location: string;
  description: string;
  photo?: string;
  isNew: boolean;
  href: string;
}

async function getResultCards(query: string, category: string): Promise<ResultCard[]> {
  if (query || category) {
    const [{ data: results }, categories] = await Promise.all([
      searchBusinesses(query, category),
      getCategories(),
    ]);
    const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
    const photos = await Promise.all(results.map(({ business }) => getListingPhotoUrl(business.slug)));

    return results.map(({ business, bestMatch }, i) => ({
      name: business.name,
      category: categoryNameById.get(bestMatch.category_id) ?? "Uncategorized",
      location: `${business.city}, ${business.state}`,
      description: business.description ?? bestMatch.name,
      photo: photos[i],
      isNew: isNewBusiness(business.created_at),
      href: `/businesses/${business.slug}`,
    }));
  }

  const businesses = await getEnrichedBusinesses();
  const photos = await Promise.all(businesses.map((b) => getListingPhotoUrl(b.slug)));
  return businesses.map((b, i) => ({
    name: b.name,
    category: b.categoryNames[0] ?? "Uncategorized",
    location: `${b.city}, ${b.state}`,
    description: b.description ?? "No description yet.",
    photo: photos[i],
    isNew: b.isNew,
    href: `/businesses/${b.slug}`,
  }));
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

  const allResults = await getResultCards(query, category);
  const GRID_CARDS = allResults.slice(0, 3);
  const LIST_ITEMS = allResults.slice(3);

  const resultCount = GRID_CARDS.length + LIST_ITEMS.length;

  return (
    <>
      <Header />

      <div className="bg-[#faf6e9]">
      <div className="max-w-[1280px] mx-auto w-full px-5 md:px-10">

      {/* ── Search Bar ── */}
      <div className="pt-5 md:pt-8">
        <SearchBar defaultValue={query} className="w-full md:max-w-[640px]" />
      </div>

      {/* ── Browse By Category ── */}
      <section>
        {/* Desktop */}
        <div className="hidden md:flex flex-col pt-[56px] pb-[32px]">
          <h2 className="font-display font-bold text-[56px] text-[#423926] leading-none mb-3">
            BROWSE BY CATEGORY
          </h2>
          <div className="h-px bg-[#dbe0d9] w-full mb-3" />
          <div className="flex items-end justify-between py-2">
            {CATEGORIES.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-[10px] w-[150px] group"
              >
                {icon ? (
                  <img
                    src={icon}
                    alt=""
                    className="w-[60px] h-[60px] object-contain"
                  />
                ) : (
                  <div className="h-[60px]" />
                )}
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
            BROWSE BY CATEGORY
          </h2>
          <div className="h-px bg-[#dbe0d9] mb-4" />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 flex-shrink-0 w-[88px] group"
              >
                {icon ? (
                  <img
                    src={icon}
                    alt=""
                    className="w-9 h-9 object-contain"
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-[#423926]" />
                  </div>
                )}
                <span className="font-mono text-[11px] text-[#423926] text-center leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <div className="h-px bg-[#dbe0d9] mt-4" />
        </div>
      </section>

      {/* ── Filter / Sort Bar ── */}
      <div className="flex items-center justify-between pt-4 pb-3 md:pt-5 md:pb-0">
        {/* Left: filter controls */}
        <div className="flex items-center gap-5 md:gap-7">
          <span className="font-mono text-[13px] md:text-[15px] text-[#423926]">
            Filter
          </span>
          <button className="flex items-center gap-1">
            <span className="font-mono text-[13px] md:text-[15px] text-[#423926] underline font-medium">
              City
            </span>
            <span className="font-mono text-[11px] md:text-[13px] text-[#423926]">⌄</span>
          </button>
          <button className="flex items-center gap-1">
            <span className="font-mono text-[13px] md:text-[15px] text-[#423926] underline font-medium">
              Category
            </span>
            <span className="font-mono text-[11px] md:text-[13px] text-[#423926]">⌄</span>
          </button>
        </div>

        {/* Right: count + sort */}
        <div className="flex items-center gap-3 md:gap-4">
          <span className="hidden md:inline font-mono text-[15px] text-[#b7a78c]">
            {resultCount} businesses
          </span>
          <span className="hidden md:inline font-mono text-[15px] text-[#dbe0d9]">|</span>
          <span className="hidden md:inline font-mono text-[15px] text-[#b7a78c]">
            Sort by
          </span>
          <button className="flex items-center gap-1">
            <span className="font-mono text-[13px] md:text-[15px] text-[#423926] underline font-medium">
              Featured
            </span>
            <span className="font-mono text-[11px] md:text-[13px] text-[#423926]">⌄</span>
          </button>
        </div>
      </div>

      {/* ── Results Heading ── */}
      <div className="flex items-center pt-4 pb-2 md:pt-5 md:pb-3">
        <div className="flex items-center gap-3">
          {query ? (
            <h1 className="font-display font-bold text-[20px] md:text-[24px] text-[#423926] uppercase whitespace-nowrap">
              Results for &ldquo;{query}&rdquo;
            </h1>
          ) : (
            <h1 className="font-display font-bold text-[20px] md:text-[24px] text-[#423926] uppercase">
              All Businesses
            </h1>
          )}
          <div className="bg-[#c9d2cf] rounded-full px-[10px] py-[5px]">
            <span className="font-mono font-bold text-[11px] md:text-[13px] text-[#423926] uppercase whitespace-nowrap">
              {resultCount} results
            </span>
          </div>
        </div>
      </div>

      {/* ── Business Grid + List ── */}
      <section className="pb-8 md:pb-12">

        {/* ── DESKTOP: 3-column grid cards ── */}
        <div className="hidden md:flex gap-6 mb-6">
          {GRID_CARDS.map((card) => (
            <Link
              key={card.name}
              href={card.href}
              className="flex-1 flex flex-col rounded-[16px] border border-[#dbe0d9] overflow-hidden bg-[#faf6e9] hover:shadow-md transition-shadow"
            >
              {/* Photo */}
              <div className="relative h-[220px] w-full bg-[#c9d2cf] flex-shrink-0 rounded-t-[16px] overflow-hidden">
                {card.photo && (
                  <img
                    src={card.photo}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
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
                <p className="font-mono text-[13px] text-[#b7a78c]">{card.location}</p>
                <p className="font-mono text-[14px] text-[#423926] leading-snug">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── MOBILE: stacked full-width cards ── */}
        <div className="md:hidden flex flex-col gap-4 mb-4">
          {GRID_CARDS.map((card) => (
            <Link
              key={card.name}
              href={card.href}
              className="flex flex-col rounded-[12px] border border-[#dbe0d9] overflow-hidden bg-[#faf6e9]"
            >
              {/* Photo */}
              <div className="relative h-[180px] w-full bg-[#c9d2cf] overflow-hidden">
                {card.photo && (
                  <img
                    src={card.photo}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
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
                <p className="font-mono text-[12px] text-[#b7a78c]">{card.location}</p>
                <p className="font-mono text-[13px] text-[#423926] leading-snug">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── List Items (desktop + mobile) ── */}
        <div className="flex flex-col">
          {LIST_ITEMS.map((item, i) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className="flex gap-4 items-center py-3 md:py-[12px] group"
              >
                {/* Thumbnail */}
                <div className="relative w-[52px] h-[52px] md:w-[72px] md:h-[72px] flex-shrink-0 rounded-[8px] md:rounded-[12px] border border-[#dbe0d9] overflow-hidden bg-[#c9d2cf]">
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
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
                    </p>
                  </div>

                  {/* Category tag */}
                  <div className="bg-[#c9d2cf] self-start px-3 py-[4px] rounded-full">
                    <span className="font-mono font-bold text-[11px] md:text-[13px] text-[#423926] uppercase whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>

                  {/* Description — hidden on mobile to keep list compact */}
                  <p className="hidden md:block font-display font-bold text-[14px] text-[#423926] leading-snug">
                    {item.description}
                  </p>
                </div>
              </Link>

              {/* Divider (skip after last) */}
              {i < LIST_ITEMS.length - 1 && (
                <div className="h-px bg-[#dbe0d9] w-full" />
              )}
            </div>
          ))}
        </div>
      </section>

      </div>{/* max-w container */}
      </div>{/* bg wrapper */}

      <Footer />
    </>
  );
}
