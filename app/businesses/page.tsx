import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "For Businesses",
  description:
    "List your Reno business on Check Local First — reach shoppers who are already looking to buy local, put a face behind your storefront, and grow your reach in the community.",
  alternates: { canonical: "/businesses" },
};

const PHOTOS = {
  intro: "/farmers1.JPG",
  reach: "/breadcompany.JPG",
  owner: "/thenest.jpg",
  story: "/modestmix.JPG",
  content: "/sasquatchsnacks.jpg",
};

const REASONS = [
  {
    heading: ["REACH SHOPPERS", "ALREADY LOOKING", "FOR YOU"],
    body: "No ads or algorithms to compete with. Every visitor to Check Local First came here on purpose, looking to shop local.",
    photo: PHOTOS.reach,
    photoRight: true,
  },
  {
    heading: ["LET THEM MEET", "THE PERSON", "BEHIND IT"],
    body: "People want to know who they're supporting. Your profile puts a face and a story behind the storefront, so customers feel like they're shopping with a neighbor, not a stranger.",
    photo: PHOTOS.owner,
    photoRight: false,
  },
  {
    heading: ["TELL YOUR STORY,", "NOT JUST YOUR", "HOURS"],
    body: "A professional business profile that goes beyond a pin on a map — what makes your business yours, why you started it, and what customers can expect when they walk in.",
    photo: PHOTOS.story,
    photoRight: true,
  },
  {
    heading: ["WE'RE STRONGER", "TOGETHER"],
    body: "Owning a small business can feel overwhelming. Join a community of like-minded business owners who share the goal of lifting each other up to strengthen Reno's local economy.",
    photo: PHOTOS.content,
    photoRight: false,
  },
];

const COPY = {
  heroHeading: "JOIN RENO'S LOCAL-FIRST MOVEMENT",
  heroSubheading: "Become part of the community people trust.",
  introPhotoAlt: "Reno local community",
  whyHeading: "WHY DO BUSINESSES JOIN?",
  whySubheading: "A few reasons local business owners say yes.",
  pricingHeading: "FOUNDING MEMBER PRICING",
  disclaimer: "Pricing and program details shown here are not final and may change before launch.",
  community: {
    tier: "FOUNDING MEMBER",
    price: "$19",
    priceSuffix: "/ Month",
    perk1: "✓ Directory listing — be found by people looking to shop local",
    perk2: "✓ “Meet the Owner” feature — let customers see who they're supporting",
    perk3: "✓ Contact & hours — links to your socials, website, and hours of operation",
  },
  premium: {
    tier: "PREMIUM",
    price: "$49",
    priceSuffix: "/ Month",
    afterPrice: "Everything in Community, plus:",
    perk1: "✓ Featured Business on homepage",
    perk2: "✓ Featured Business post on social media",
    perk3: "✓ A free consumer account for the owner",
    perk4: "✓ Expanded scrolling photo gallery on your listing",
  },
  ctaText: "Starting small, so we can grow the right way. Become a founding business.",
  ctaButtonDesktop: "Become a Founding Business →",
  ctaButtonMobile: "BECOME A FOUNDING BUSINESS →",
};

export default function BusinessesPage() {
  return (
    <main className="bg-[#faf6e9]">
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

      {/* ── Hero ── */}
      <div className="bg-[#faf6e9] px-[16px] md:px-[64px] pt-[24px] md:pt-[56px] pb-[24px] md:pb-[40px] flex flex-col gap-[24px]">
        <h1 className="font-display font-bold text-[30px] md:text-[52px] text-[#423926] tracking-[-1px] leading-tight md:leading-none">
          {COPY.heroHeading}
        </h1>
        <p className="font-body text-[20px] text-[#423926]">
          {COPY.heroSubheading}
        </p>
        <div className="hidden md:block bg-[#b7a78c] h-[3px] w-full" />
      </div>

      {/* ── Intro Photo ── */}
      <div className="bg-[#faf6e9] px-[16px] md:px-[64px] pb-[48px] md:pb-[64px]">
        <div className="relative h-[220px] md:h-[360px] bg-[#c9d2cf] rounded-[4px] overflow-hidden">
          <Image src={PHOTOS.intro} alt={COPY.introPhotoAlt} fill sizes="100vw" className="object-cover" />
        </div>
      </div>

      {/* ── Why Businesses Join ── */}
      <section className="bg-[#faf6e9] pb-[48px] md:pb-[64px]">
        {/* Section header */}
        <div className="px-[16px] md:px-[64px] pt-[40px] md:pt-[56px] pb-[24px] flex flex-col items-start md:items-center gap-[12px]">
          <h2 className="font-display font-bold text-[24px] md:text-[40px] text-[#423926]">
            {COPY.whyHeading}
          </h2>
          <p className="font-body text-[20px] text-[#423926]">
            {COPY.whySubheading}
          </p>
        </div>

        {/* Reason splits */}
        <div className="flex flex-col gap-[40px] md:gap-0 px-[16px] md:px-0">
          {REASONS.map(({ heading, body, photo, photoRight }, i) => (
            <div key={i}>
              {/* Mobile: photo → heading → body */}
              <div className="md:hidden flex flex-col gap-[20px]">
                <div className="relative h-[220px] rounded-[4px] overflow-hidden bg-[#c9d2cf]">
                  <Image src={photo} alt="" fill sizes="100vw" className="object-cover" />
                </div>
                <div className="font-display font-bold text-[22px] text-[#423926] tracking-[-1px]">
                  {heading.map((line, j) => (
                    <p key={j} className="leading-tight">
                      {line}
                    </p>
                  ))}
                </div>
                <p className="font-body text-[20px] text-[#423926] leading-[1.6]">{body}</p>
              </div>

              {/* Desktop: text + photo, alternating sides */}
              <div className="hidden md:flex h-[620px]">
                {!photoRight && (
                  <div className="relative w-1/2 h-full bg-[#c9d2cf] overflow-hidden flex-shrink-0">
                    <Image src={photo} alt="" fill sizes="50vw" className="object-cover" />
                  </div>
                )}
                <div className="flex flex-col gap-[20px] justify-center w-1/2 px-[72px]">
                  <div className="font-display font-bold text-[40px] text-[#423926] tracking-[-1px]">
                    {heading.map((line, j) => (
                      <p key={j} className="leading-tight">
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="font-body text-[20px] text-[#423926] leading-[1.6]">{body}</p>
                </div>
                {photoRight && (
                  <div className="relative w-1/2 h-full bg-[#c9d2cf] overflow-hidden flex-shrink-0">
                    <Image src={photo} alt="" fill sizes="50vw" className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Founding Member Pricing (Desktop) ── */}
      <div className="hidden md:flex flex-col items-center gap-[32px] bg-[#faf6e9] px-[64px] pt-[16px] pb-[64px]">
        <h2 className="font-display font-bold text-[40px] text-[#423926] text-center">
          {COPY.pricingHeading}
        </h2>

        {/* Pricing cards */}
        <div className="flex gap-[40px] w-full max-w-[900px]">
          {/* Community Card */}
          <div className="bg-white rounded-[16px] flex-1 p-[32px] flex flex-col min-h-[328px]">
            <p className="font-display font-bold text-[14px] text-[#b7a78c]">{COPY.community.tier}</p>
            <div className="flex items-baseline gap-[12px] mt-[32px]">
              <p className="font-display font-bold text-[40px] text-[#151814] leading-none">{COPY.community.price}</p>
              <p className="font-display text-[16px] text-[#b7a78c]">{COPY.community.priceSuffix}</p>
            </div>
            <div className="mt-[20px] flex flex-col gap-[12px]">
              <p className="font-display text-[14px] text-[#151814]">
                {COPY.community.perk1}
              </p>
              <p className="font-display text-[14px] text-[#151814]">
                {COPY.community.perk2}
              </p>
              <p className="font-display text-[14px] text-[#151814]">
                {COPY.community.perk3}
              </p>
            </div>
          </div>

          {/* Premium Card */}
          <div className="bg-[#2c4a34] rounded-[16px] flex-1 p-[32px] flex flex-col min-h-[319px]">
            <p className="font-display font-bold text-[14px] text-[#e8ebe6]">{COPY.premium.tier}</p>
            <div className="flex items-baseline gap-[12px] mt-[32px]">
              <p className="font-display font-bold text-[40px] text-white leading-none">{COPY.premium.price}</p>
              <p className="font-display text-[16px] text-[#e8ebe6]">{COPY.premium.priceSuffix}</p>
            </div>
            <p className="font-display font-bold text-[13px] text-white mt-[16px]">
              {COPY.premium.afterPrice}
            </p>
            <div className="mt-[12px] flex flex-col gap-[10px]">
              <p className="font-display text-[14px] text-white">{COPY.premium.perk1}</p>
              <p className="font-display text-[14px] text-white">
                {COPY.premium.perk2}
              </p>
              <p className="font-display text-[14px] text-white">
                {COPY.premium.perk3}
              </p>
              <p className="font-display text-[14px] text-white">
                {COPY.premium.perk4}
              </p>
            </div>
          </div>
        </div>

        <p className="font-body text-[13px] text-[#b7a78c] text-center max-w-[516px]">
          {COPY.disclaimer}
        </p>
      </div>

      {/* ── Founding Member Pricing (Mobile) ── */}
      <div className="md:hidden bg-[#faf6e9] px-[16px] pt-[40px] pb-[32px] flex flex-col gap-[20px]">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">
          {COPY.pricingHeading}
        </h2>

        {/* Community Card Mobile */}
        <div className="bg-[#253022] rounded-[16px] p-[24px] flex flex-col gap-[12px]">
          <p className="font-display font-bold text-[14px] text-[#faf6e9]">{COPY.community.tier}</p>
          <div className="flex items-baseline gap-[10px]">
            <p className="font-display font-bold text-[30px] text-[#faf6e9] leading-none">{COPY.community.price}</p>
            <p className="font-body text-[16px] text-[#faf6e9] opacity-70">{COPY.community.priceSuffix}</p>
          </div>
          <div className="flex flex-col gap-[10px] mt-[4px]">
            <p className="font-body text-[14px] text-[#faf6e9]">
              {COPY.community.perk1}
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              {COPY.community.perk2}
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              {COPY.community.perk3}
            </p>
          </div>
        </div>

        {/* Premium Card Mobile */}
        <div className="bg-[#c96f47] rounded-[16px] p-[24px] flex flex-col gap-[12px]">
          <p className="font-display font-bold text-[14px] text-[#faf6e9]">{COPY.premium.tier}</p>
          <div className="flex items-baseline gap-[10px]">
            <p className="font-display font-bold text-[30px] text-[#faf6e9] leading-none">{COPY.premium.price}</p>
            <p className="font-body text-[16px] text-[#faf6e9] opacity-70">{COPY.premium.priceSuffix}</p>
          </div>
          <p className="font-body text-[13px] text-[#faf6e9] opacity-60">
            {COPY.premium.afterPrice}
          </p>
          <div className="flex flex-col gap-[10px] mt-[4px]">
            <p className="font-body text-[14px] text-[#faf6e9]">{COPY.premium.perk1}</p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              {COPY.premium.perk2}
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              {COPY.premium.perk3}
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              {COPY.premium.perk4}
            </p>
          </div>
        </div>

        <p className="font-body text-[13px] text-[#b7a78c]">
          {COPY.disclaimer}
        </p>
      </div>

      {/* ── Bottom CTA ── */}
      {/* Desktop */}
      <div className="hidden md:flex flex-col items-center justify-center gap-[24px] bg-[#2c4a34] p-[64px]">
        <p className="font-display font-bold text-[32px] text-[#faf6e9] text-center max-w-[900px] leading-tight">
          {COPY.ctaText}
        </p>
        <Link
          href="/signup"
          className="bg-[#bc6239] rounded-full px-[32px] py-[16px] font-body font-bold text-[16px] text-[#faf6e9] hover:opacity-90 transition-opacity"
        >
          {COPY.ctaButtonDesktop}
        </Link>
      </div>
      {/* Mobile */}
      <div className="md:hidden bg-[#2c4a34] px-[16px] py-[48px] flex flex-col items-center gap-[24px]">
        <p className="font-display font-bold text-[20px] text-[#faf6e9] text-center">
          {COPY.ctaText}
        </p>
        <Link
          href="/signup"
          className="bg-[#253022] rounded-[8px] h-[52px] w-full flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <span className="font-display font-bold text-[14px] text-[#faf6e9]">
            {COPY.ctaButtonMobile}
          </span>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
