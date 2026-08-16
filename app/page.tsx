import Image from "next/image";
import Link from "next/link";
import JoinNowLink from "@/components/JoinNowLink";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FollowCarousel from "@/components/FollowCarousel";
import NeighborsCarousel from "@/components/NeighborsCarousel";
import TextWithBreaks from "@/components/TextWithBreaks";
import { getEnrichedBusinesses, getFeaturedBusiness, getListingPhotoUrl } from "@/lib/directory";

/* ─────────────────────────────────────────────
   Figma image assets — 7-day URLs.
   Replace with /public files for production.
───────────────────────────────────────────── */
const IMG = {
  heroDesktop:     "/mainpage2.JPG",
  wordmarkDesktop: "/clfheadlogo.png",
  heroMobile:      "/mainpage2.JPG",
  wordmarkMobile:  "/clfheadlogo.png",
  aboutMobile:     "/mainpage1.JPG",
  aboutDesktop:    "/market.JPG",
  ig1:             "/breadcompany.JPG",
  ig2:             "/farmers1.JPG",
  ig3:             "/modestmix.JPG",
  ig4:             "/sasquatchsnacks.jpg",
};

const INSTAGRAM_URL = "https://www.instagram.com/checklocalfirstreno/";

// User-facing copy, kept together so wording can be edited without touching layout/markup below.
const COPY = {
  heroTagline: "Your guide to local shopping in Reno, NV",
  heroSearchPlaceholder: "Search businesses, food & more...",
  aboutPhotoAlt: "About Check Local First",
  startExploring: {
    heading: "Start Exploring",
    mobileBody:
      "Check Local First is Reno's local directory. Browse by category or search for exactly what you need, then save the places you want to come back to.",
    desktopBody1:
      "Check Local First is Reno's local directory, browse by category or search for exactly what you need, save the places you love, and discover the independently owned shops that make this city what it is.",
    desktopBody2:
      "Sign up to join a community that keeps Reno's money in Reno, while unlocking exclusive member discounts along the way.",
  },
  aboutUs: {
    eyebrow: "About us",
    mobileHeading: "Every dollar is a vote",
    mobileBody:
      "Check Local First started with a simple idea: every dollar spent at a local business is a vote for the kind of city you want to live in. Every listing here is here because someone who loves this place vouched for it.",
    mobileLink: "Learn more about our story",
    desktopHeading: "About Us",
    desktopBody:
      "Check Local First started with a simple idea: every dollar spent at a local business is a vote for the kind of community we want to live in. We built this directory to make it effortless to find, support, and celebrate the small businesses that make Reno the Biggest Little City — and to keep neighbors connected to the people behind the counter.",
    desktopLink: "Learn More About Our Story",
  },
  featured: {
    mobileEyebrow: "Featured business",
    desktopEyebrow: "FEATURED BUSINESS",
    mobileCta: "View full profile",
    desktopCta: "VIEW FULL PROFILE",
    fallbackDescription: "No description provided yet..",
  },
  becomeMember: {
    eyebrow: "Membership",
    heading: "Become a Member",
    body:
      "Members get exclusive discounts at local shops, and as our community grows, those perks only multiply. More than that, joining means investing in your neighborhood, keeping your money close to home, and building real connections with the people around you.",
    cta: "Join as a Member",
  },
  beFound: {
    heading: "Get Found by Local Customers",
    mobileBody:
      "Own an independent business in the Reno–Tahoe area? List your business and get connected with shoppers who are actively looking to buy local — a community that already loves where they shop.",
    desktopBody:
      "Own an independent business in the Reno–Tahoe area? List your business and get connected with shoppers who are actively looking to buy local — a community that already cares where their money goes. Share your hours, upload photos, and let neighbors discover the heart of your trade.",
    cta: "List your business",
  },
  followCommunity: {
    mobileHeading: "Follow the community",
    desktopHeading: "Follow THE COMMUNITY",
    handle: "@checklocalfirst",
  },
};

// Shown only when GET /businesses/featured has nothing set, or the featured
// business hasn't had a listing photo uploaded yet — keeps the homepage from
// ever showing a broken/empty featured slot.
const FEATURED_FALLBACK = {
  name: "The Nest",
  slug: "the-nest",
  img: "/the-nest.jpg",
};

const MARQUEE_ITEMS = [
  "Made with intention", "Made in Reno, NV",
  "Made with intention", "Made in Reno, NV",
  "Made with intention", "Made in Reno, NV",
  "Made with intention", "Made in Reno, NV",
];

function Dot() {
  return <span className="inline-block w-[6px] h-[6px] rounded-full bg-white opacity-60 flex-shrink-0" />;
}

function ChevronRight({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M13 8l-4-4M13 8l-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const revalidate = 60;

export default async function HomePage() {
  const businesses = await getEnrichedBusinesses();

  const carouselBusinesses = businesses.filter((b) => b.in_carousel);
  const neighborBusinesses = carouselBusinesses.length > 0 ? carouselBusinesses : businesses.slice(0, 4);
  const neighborPhotos = await Promise.all(neighborBusinesses.map((b) => getListingPhotoUrl(b.slug)));
  const neighbors = neighborBusinesses.map((b, i) => ({
    category: b.categoryNames[0] ?? "Local Business",
    name: b.name,
    neighborhood: `${b.city}, ${b.state}`,
    description: b.description,
    img: neighborPhotos[i] ?? null,
    href: `/businesses/${b.slug}`,
  }));

  const featuredBusiness = await getFeaturedBusiness().catch(() => null);
  const featuredPhotoUrl = featuredBusiness
    ? await getListingPhotoUrl(featuredBusiness.slug).catch(() => undefined)
    : undefined;
  const useFeaturedFallback = !featuredBusiness || !featuredPhotoUrl;

  const featuredEnriched = featuredBusiness
    ? businesses.find((b) => b.slug === featuredBusiness.slug)
    : undefined;

  const featured = useFeaturedFallback
    ? { name: FEATURED_FALLBACK.name, slug: FEATURED_FALLBACK.slug, description: null as string | null }
    : featuredBusiness!;
  const featuredImg = useFeaturedFallback ? FEATURED_FALLBACK.img : featuredPhotoUrl!;
  const featuredCategory = useFeaturedFallback
    ? "Local Business"
    : featuredEnriched?.categoryNames[0] ?? "Local Business";

  return (
    <>
      <Header />

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}

      {/* Desktop */}
      <section className="hidden md:block relative h-[620px] w-full overflow-hidden bg-[#faf6e9]">
        <Image
          src={IMG.heroDesktop}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45 pointer-events-none" />

        {/* Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[383px] h-[270px]">
          <Image
            src={IMG.wordmarkDesktop}
            alt="Check Local First"
            fill
            priority
            sizes="383px"
            className="object-contain"
          />
        </div>

        {/* Tagline */}
        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[1029px] text-center font-display font-bold text-[40px] text-[#faf6e9]">
          {COPY.heroTagline}
        </p>

        {/* Search bar */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[880px]">
          <SearchBar className="h-[64px]" />
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden relative h-[560px] w-full flex flex-col items-center justify-center gap-7 px-[26px] overflow-hidden">
        <Image
          src={IMG.heroMobile}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[rgba(21,24,20,0.36)] pointer-events-none" />

        <div className="relative w-[288px] h-[203px]">
          <Image
            src={IMG.wordmarkMobile}
            alt="Check Local First"
            fill
            priority
            sizes="288px"
            className="object-contain"
          />
        </div>

        <SearchBar placeholder={COPY.heroSearchPlaceholder} className="w-full" />

        <p className="relative font-body text-[12px] text-[#f0edd8] text-center leading-5">
          {COPY.heroTagline}
        </p>
      </section>

      {/* ════════════════════════════════
          MARQUEE TICKER
      ════════════════════════════════ */}
      <div className="bg-[#2c4a34] relative overflow-hidden flex items-center h-[47px] md:h-[92px]">
        <div className="absolute left-0 top-0 h-full w-16 md:w-[90px] bg-gradient-to-r from-[#2c4a34] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-16 md:w-[90px] bg-gradient-to-l from-[#2c4a34] to-transparent z-10 pointer-events-none" />
        <div className="flex gap-6 items-center animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="font-display font-bold text-[13px] md:text-[20px] text-white uppercase">{item}</span>
              <Dot />
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          START EXPLORING
      ════════════════════════════════ */}
      <section className="bg-[#faf6e9] flex flex-col items-center text-center gap-[18px] md:gap-10 px-[30px] md:px-[240px] pt-[60px] md:pt-20 pb-12 md:pb-[120px]">
        <h2 className="font-display font-bold text-[26px] md:text-[64px] leading-tight text-[#253022] uppercase w-full">
          {COPY.startExploring.heading}
        </h2>
        {/* Mobile */}
        <p className="md:hidden font-body text-[12px] text-[#596155] leading-[22px] w-full">
          {COPY.startExploring.mobileBody}
        </p>
        {/* Desktop */}
        <p className="hidden md:block font-body text-[20px] text-[#596155] leading-[1.6] w-full">
          {COPY.startExploring.desktopBody1}
          <br /><br />
          {COPY.startExploring.desktopBody2}
        </p>
      </section>

      {/* ════════════════════════════════
          MEET YOUR NEIGHBORS
      ════════════════════════════════ */}

      <NeighborsCarousel businesses={neighbors} />

      {/* ════════════════════════════════
          ABOUT US
      ════════════════════════════════ */}

      {/* Mobile */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col pb-[56px]">
        <div className="relative h-[320px] w-full overflow-hidden">
          <Image src={IMG.aboutMobile} alt={COPY.aboutPhotoAlt} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-4 items-center text-center pt-11 px-[30px]">
          <p className="font-display font-bold text-[9px] text-[#b7a78c] tracking-[3px] uppercase w-full">{COPY.aboutUs.eyebrow}</p>
          <h2 className="font-display font-bold text-[24px] text-[#253022] leading-[32px] w-full">{COPY.aboutUs.mobileHeading}</h2>
          <p className="font-body text-[12px] text-[#596155] leading-[22px] w-full">
            {COPY.aboutUs.mobileBody}
          </p>
          <Link href="/about" className="font-display font-bold text-[10px] text-[#253022] tracking-[1.6px] uppercase underline w-full">
            {COPY.aboutUs.mobileLink}
          </Link>
        </div>
      </section>

      {/* Desktop */}
      <section className="hidden md:flex items-center gap-20 bg-[#faf6e9] px-20 py-[120px]">
        <div className="shadow-[-4px_12px_16px_rgba(37,48,34,0.08)] rounded-[4px] p-6 flex-shrink-0 w-[440px] overflow-hidden">
          <div className="relative h-[360px] w-full rounded-[2px] overflow-hidden">
            <Image src={IMG.aboutDesktop} alt={COPY.aboutPhotoAlt} fill sizes="440px" className="object-cover" />
          </div>
        </div>
        <div className="flex flex-col gap-8 flex-1">
          <h2 className="font-display font-bold text-[64px] text-[#151814] uppercase leading-none">{COPY.aboutUs.desktopHeading}</h2>
          <div className="bg-[#f4f3ee] border border-[#dbe0d9] rounded-[16px] p-10 flex flex-col gap-6">
            <p className="font-body text-[20px] text-[#151814] leading-[1.6]">
              {COPY.aboutUs.desktopBody}
            </p>
            <Link href="/about" className="font-display font-bold text-[20px] text-[#253022] uppercase underline flex items-center gap-2 hover:opacity-70 transition-opacity">
              {COPY.aboutUs.desktopLink} <ChevronRight color="#253022" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURED BUSINESS
      ════════════════════════════════ */}

      {/* Mobile */}
      <section className="md:hidden bg-[#d9d1c7] flex flex-col">
        <div className="flex flex-col gap-[14px] items-center text-center pt-[56px] pb-6 px-[30px]">
          <p className="font-display font-bold text-[9px] text-[#6b7d67] tracking-[3px] uppercase w-full">{COPY.featured.mobileEyebrow}</p>
          <h2 className="font-display font-bold text-[30px] text-[#253022] leading-[38px] w-full">{featured.name}</h2>
          <p className="font-display font-bold text-[9px] text-[#423926] tracking-[1.8px] uppercase w-full">
            {featuredCategory}
          </p>
        </div>
        <div className="px-5 pt-[10px]">
          <div className="relative h-[300px] w-full rounded-[2px] overflow-hidden bg-[#c9d2cf]">
            <Image src={featuredImg} alt={featured.name} fill sizes="100vw" className="object-cover" />
          </div>
        </div>
        <div className="flex flex-col gap-5 items-center text-center pt-7 pb-[56px] px-[30px]">
          <p className="font-body text-[12px] text-[#423926] leading-[22px]">
            <TextWithBreaks text={featured.description ?? COPY.featured.fallbackDescription} />
          </p>
          <Link href={`/businesses/${featured.slug}`} className="bg-[#2c4a34] text-[#faf6e9] font-display font-bold text-[10px] tracking-[1.8px] uppercase px-7 py-4 rounded-[2px] hover:bg-[#253022] transition-colors">
            {COPY.featured.mobileCta}
          </Link>
        </div>
      </section>

      {/* Desktop */}
      <section className="hidden md:block relative bg-[#faf6e9] py-24 overflow-hidden">
        <div className="px-20">
          <p className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-wider">{COPY.featured.desktopEyebrow}</p>
          <p className="font-display font-bold text-[40px] text-[#151814] mt-[6px]">{featured.name.toUpperCase()}</p>
          <p className="font-display font-bold text-[13px] text-[#596155] uppercase mt-1">{featuredCategory}</p>

          <div className="flex gap-20 mt-[48px]">
            {/* Left: photo */}
            <div className="relative h-[340px] w-[560px] flex-shrink-0 rounded-[12px] overflow-hidden bg-[#c9d2cf]">
              <Image src={featuredImg} alt={featured.name} fill sizes="560px" className="object-cover" />
            </div>

            {/* Right: text */}
            <div className="flex flex-col gap-7 flex-1">
              <p className="font-display text-[17px] text-[#151814] leading-relaxed">
                <TextWithBreaks text={featured.description ?? COPY.featured.fallbackDescription} />
              </p>
              <Link href={`/businesses/${featured.slug}`} className="inline-flex items-center gap-3 bg-[#2c4a34] text-white font-display font-bold text-[16px] uppercase px-6 h-12 rounded-[8px] w-fit hover:bg-[#253022] transition-colors">
                {COPY.featured.desktopCta} <ChevronRight color="white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          BECOME A MEMBER
      ════════════════════════════════ */}
      <section className="flex flex-col items-center text-center gap-[18px] md:gap-8 px-8 md:px-[240px] py-16 md:py-[100px] bg-[#2c4a34] md:bg-[#423926]">
        <p className="md:hidden font-display font-bold text-[9px] text-[#b5c98a] tracking-[3px] uppercase">{COPY.becomeMember.eyebrow}</p>
        <h2 className="font-display font-bold text-[24px] md:text-[64px] text-[#faf6e9] uppercase tracking-[0.5px] md:tracking-normal leading-[30px] md:leading-none">
          {COPY.becomeMember.heading}
        </h2>
        {/* Mobile */}
        <p className="md:hidden font-body text-[12px] text-[#e8ebe6] leading-[22px]">
          {COPY.becomeMember.body}
        </p>
        {/* Desktop */}
        <p className="hidden md:block font-body text-[20px] text-[#e8ebe6] leading-[1.6]">
          {COPY.becomeMember.body}
        </p>
        <JoinNowLink className="bg-[#faf6e9] md:bg-[#faf8f5] text-[#253022] font-display font-bold text-[10px] md:text-[20px] tracking-[1.8px] md:tracking-normal uppercase px-7 md:px-10 py-4 rounded-[2px] md:rounded-[100px] inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
          {COPY.becomeMember.cta}
          <span className="hidden md:block"><ChevronRight color="#253022" /></span>
        </JoinNowLink>
      </section>

      {/* ════════════════════════════════
          BE FOUND
      ════════════════════════════════ */}
      <section className="flex flex-col items-center text-center gap-[18px] md:gap-8 px-7 md:px-[240px] pt-[60px] md:py-[100px] pb-[56px] bg-[#faf6e9] border-b border-[#dbe0d9]">
        <h2 className="font-display font-bold text-[22px] md:text-[64px] text-[#253022] uppercase tracking-[0.5px] md:tracking-normal leading-[30px] md:leading-none">
          {COPY.beFound.heading}
        </h2>
        {/* Mobile */}
        <p className="md:hidden font-body text-[12px] text-[#596155] leading-[22px]">
          {COPY.beFound.mobileBody}
        </p>
        {/* Desktop */}
        <p className="hidden md:block font-body text-[20px] text-[#596155] leading-[1.6]">
          {COPY.beFound.desktopBody}
        </p>
        <Link href="/signup" className="border border-[#253022] md:bg-[#253022] md:border-transparent md:text-white text-[#253022] font-display font-bold text-[10px] md:text-[20px] tracking-[1.8px] md:tracking-normal uppercase px-7 md:px-10 py-[15px] md:py-4 rounded-[2px] md:rounded-[100px] inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          {COPY.beFound.cta}
          <span className="hidden md:block"><ChevronRight color="white" /></span>
        </Link>
      </section>

      {/* ════════════════════════════════
          FOLLOW THE COMMUNITY
      ════════════════════════════════ */}

      {/* Mobile */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col gap-5 pb-[56px]">
        <div className="flex flex-col gap-2 items-center text-center px-7 pt-[56px]">
          <h2 className="font-display font-bold text-[17px] text-[#253022] tracking-[0.5px] uppercase w-full">{COPY.followCommunity.mobileHeading}</h2>
          <p className="font-body text-[11px] text-[#596155] w-full">{COPY.followCommunity.handle}</p>
        </div>
        <div className="flex flex-col gap-[2px]">
          <div className="flex gap-[2px] h-[128px]">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <Image src={IMG.ig1} alt="" fill sizes="33vw" className="object-cover" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <Image src={IMG.ig2} alt="" fill sizes="33vw" className="object-cover" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <Image src={IMG.ig3} alt="" fill sizes="33vw" className="object-cover" />
            </a>
          </div>
          <div className="flex gap-[2px] h-[128px]">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <Image src={IMG.ig4} alt="" fill sizes="33vw" className="object-cover" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <Image src={IMG.ig1} alt="" fill sizes="33vw" className="object-cover" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <Image src={IMG.ig2} alt="" fill sizes="33vw" className="object-cover" />
            </a>
          </div>
        </div>
      </section>

      {/* Desktop */}
      <section className="hidden md:flex flex-col bg-[#faf6e9]">
        <div className="px-20 pt-16">
          <h2 className="font-display font-bold text-[64px] text-[#151814] uppercase">{COPY.followCommunity.desktopHeading}</h2>
        </div>
        <FollowCarousel />
        <p className="font-body text-[20px] text-[#6b7d67] text-center py-6">{COPY.followCommunity.handle}</p>
      </section>

      <Footer />
    </>
  );
}
