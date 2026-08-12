import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import FeatureAccordion from "@/components/FeatureAccordion";
import JoinNowLink from "@/components/JoinNowLink";

export const metadata: Metadata = {
  title: "Business Membership",
  description:
    "Compare Check Local First's Community and Premium business membership tiers — directory listing, homepage rotation, featured placement, and more.",
  alternates: { canonical: "/membership/businesses" },
};

const COMMUNITY_FEATURES = [
  {
    label: "Directory Listing",
    description:
      "Your business gets a dedicated page on the Check Local First directory, complete with your name, address, hours, photos, and a link to your website — all in one place for locals to find you.",
  },
  {
    label: "Meet the Owner",
    description:
      "Introduce yourself with a short bio and photo. People love knowing who they're supporting, and a familiar face turns a listing into a connection.",
  },
  {
    label: "Contact & Hours",
    description:
      "Display your phone number, email, social links, and weekly hours so customers can find and reach you easily — no more missed calls from people who couldn't figure out when you're open.",
  },
];

const PREMIUM_FEATURES = [
  {
    label: "Homepage Rotation",
    description:
      "Your business appears on the Check Local First homepage, rotating with other premium members. It's the first thing visitors see — before they've even searched for anything.",
  },
  {
    label: "Featured Business Placement",
    description:
      "Get highlighted at the top of search results and category pages, putting you in front of shoppers before they scroll past anyone else.",
  },
  {
    label: "Personal Shopper Account",
    description:
      "As a premium member you also get a free personal shopper account, so you can discover, save, and support other local businesses as a member of the community yourself.",
  },
];

const GALLERY = [
  "/farmers1.JPG",
  "/thenest.jpg",
  "/market.JPG",
  "/breadcompany.JPG",
  "/modestmix.JPG",
  "/sasquatchsnacks.jpg",
  "/farmers1.JPG",
  "/thenest.jpg",
];

const IMG = {
  hero: "/market.JPG",
};

const COPY = {
  heroHeading: "JOIN THE CLUB",
  heroPhotoAlt: "Local market scene",
  introLeft:
    "Membership at Check Local First means real support for your business — a listing that actually gets seen by Reno neighbors who are ready to buy local.",
  introRight:
    "Every tier includes a free profile on the directory. Upgrade for homepage features, unlimited photos, and priority placement in local search.",
  pricingHeading: "PRICING & PACKAGES",
  pricingSubheading:
    "Every membership includes a free directory profile. Choose a tier that fits how visible you want your business to be.",
  pricingCta: "Join Now →",
  community: {
    tier: "COMMUNITY",
    blurb: "Perfect for businesses just getting started with an online presence.",
  },
  premium: {
    tier: "PREMIUM",
    blurb:
      "Maximum visibility for businesses who want to be everyone's first stop — plus a personal account so the owner can shop local too.",
    galleryLabel: "Photo Gallery (Scroll for more)",
  },
};

const PRICING_CARDS = {
  community: {
    price: "$19",
    tier: COPY.community.tier,
    features: ["Directory listing", "Meet the Owner", "Contact & hours"],
  },
  premium: {
    price: "$49",
    tier: COPY.premium.tier,
    features: [
      "Everything in Community",
      "Homepage rotation",
      "Featured business placement",
      "Personal shopper account for you",
    ],
  },
};

function PricingCard({
  bg,
  price,
  tier,
  features,
}: {
  bg: string;
  price: string;
  tier: string;
  features: string[];
}) {
  return (
    <div
      className={`${bg} rounded-[20px] px-7 py-8 flex flex-col gap-5 w-full md:w-[392px]`}
    >
      {/* Price row */}
      <div className="flex items-baseline gap-1 text-[#faf6e9]">
        <span className="font-body italic font-bold text-[34px] leading-none">{price}</span>
        <span className="font-body text-[15px]">/ Month</span>
      </div>

      {/* Tier name */}
      <p className="font-display font-bold text-[15px] text-[#faf6e9] uppercase tracking-wide">
        {tier}
      </p>

      {/* Features */}
      <ul className="flex flex-col gap-2 font-body text-[14px] text-[#faf6e9]">
        {features.map((f) => (
          <li key={f}>- {f}</li>
        ))}
      </ul>

      {/* CTA */}
      <JoinNowLink className="mt-auto bg-[#2c4a34] rounded-full flex items-center justify-center px-7 py-3 text-[#faf6e9] font-body font-semibold text-[15px] hover:bg-[#253022] transition-colors">
        {COPY.pricingCta}
      </JoinNowLink>
    </div>
  );
}

export default function BusinessMembershipPage() {
  return (
    <>
      <Header />

      {/* ── Search Bar Row ── */}
      <div className="bg-[#faf6e9] border-b border-[#dbe0d9] flex justify-center items-center h-[78px] px-5 md:h-[112px]">
        <SearchBar className="w-full md:w-[880px]" />
      </div>

      {/* ── 01 Hero ── */}
      <section className="bg-[#faf6e9] px-4 pt-10 pb-6 md:px-[64px]">
        <h1 className="font-display font-bold text-[32px] md:text-[88px] text-[#423926] tracking-[-1px] leading-none">
          {COPY.heroHeading}
        </h1>
        <div className="h-[3px] bg-[#b7a78c] mt-4" />
      </section>

      {/* ── 02 Intro Text ── */}
      <section className="bg-[#faf6e9] px-4 pb-12 md:px-[64px] md:pb-[64px]">
        {/* Hero photo */}
        <div className="relative h-[200px] md:h-[420px] bg-[#c9d2cf] rounded-[4px] overflow-hidden mb-8">
          <Image src={IMG.hero} alt={COPY.heroPhotoAlt} fill priority sizes="100vw" className="object-cover" />
        </div>

        {/* Two-column text on desktop, stacked on mobile */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-16">
          <p className="font-body text-[15px] text-[#423926] leading-[1.5] md:flex-1">
            {COPY.introLeft}
          </p>
          <p className="font-body text-[15px] text-[#423926] leading-[1.5] md:flex-1">
            {COPY.introRight}
          </p>
        </div>
      </section>

      {/* ── 03 Pricing & Packages ── */}
      <section className="bg-[#faf6e9] px-4 pt-0 pb-12 md:px-[64px] md:pt-[48px] md:pb-[96px]">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3 text-center mb-8 md:mb-12">
          <h2 className="font-display font-bold text-[26px] md:text-[64px] text-[#423926] leading-none">
            {COPY.pricingHeading}
          </h2>
          <p className="font-body text-[15px] md:text-[16px] text-[#423926] max-w-[620px] leading-snug">
            {COPY.pricingSubheading}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-7 md:justify-center">
          <PricingCard bg="bg-[#9ca889]" {...PRICING_CARDS.community} />
          <PricingCard bg="bg-[#bc6239]" {...PRICING_CARDS.premium} />
        </div>
      </section>

      {/* ── 04 Tier Detail Blocks ── */}
      <section className="bg-[#faf6e9] px-4 pb-12 flex flex-col gap-4 md:px-[64px] md:pb-[96px] md:gap-8">

        {/* ── Community ── */}
        {/* Desktop */}
        <div className="hidden md:flex bg-[#423926] rounded-[20px] p-[56px] gap-16 items-center">
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <h3 className="font-display font-bold text-[64px] text-[#faf6e9] leading-none">
              {COPY.community.tier}
            </h3>
            <p className="font-body text-[14px] text-[#b7a78c]">
              {COPY.community.blurb}
            </p>
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <FeatureAccordion
              features={COMMUNITY_FEATURES}
              labelColor="text-[#faf6e9]"
              descColor="text-[#d9d9cc]"
              dividerColor="border-[#b7a78c]"
              plusColor="text-[#bc6239]"
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden bg-[#253022] rounded-[16px] p-6">
          <h3 className="font-display font-bold text-[30px] text-[#faf6e9] leading-none mb-3">
            {COPY.community.tier}
          </h3>
          <p className="font-body text-[14px] text-[#d9d9cc] mb-5">
            {COPY.community.blurb}
          </p>
          <FeatureAccordion
            features={COMMUNITY_FEATURES}
            labelColor="text-[#faf6e9]"
            descColor="text-[#d9d9cc]"
            dividerColor="border-[rgba(250,246,233,0.25)]"
            plusColor="text-[#bc6239]"
          />
        </div>

        {/* ── Premium ── */}
        {/* Desktop */}
        <div className="hidden md:flex flex-col bg-[#c9d2cf] rounded-[20px] px-[56px] py-[40px] gap-6">
          {/* Top row */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3 min-w-0" style={{ width: "568px" }}>
              <h3 className="font-display font-bold text-[64px] text-[#423926] leading-none">
                {COPY.premium.tier}
              </h3>
              <p className="font-body text-[14px] text-[#423926]">
                {COPY.premium.blurb}
              </p>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <FeatureAccordion
                features={PREMIUM_FEATURES}
                labelColor="text-[#423926]"
                descColor="text-[#596155]"
                dividerColor="border-[#b7a78c]"
                plusColor="text-[#2c4a34]"
              />
            </div>
          </div>

          {/* Gallery strip */}
          <div className="flex flex-col gap-2">
            <p className="font-body font-semibold text-[12px] text-white uppercase tracking-[0.6px]">
              {COPY.premium.galleryLabel}
            </p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {GALLERY.map((src, i) => (
                <div
                  key={i}
                  className="relative w-[90px] h-[62px] flex-shrink-0 rounded-[6px] overflow-hidden bg-[rgba(240,222,199,0.9)]"
                >
                  <Image src={src} alt="" fill sizes="90px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden bg-[#c9d2cf] rounded-[16px] p-6">
          <h3 className="font-display font-bold text-[30px] text-[#253022] leading-none mb-3">
            {COPY.premium.tier}
          </h3>
          <p className="font-body text-[14px] text-[#595e5c] mb-5">
            {COPY.premium.blurb}
          </p>
          <FeatureAccordion
            features={PREMIUM_FEATURES}
            labelColor="text-[#253022]"
            descColor="text-[#596155]"
            dividerColor="border-[rgba(37,48,34,0.25)]"
            plusColor="text-[#2c4a34]"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
