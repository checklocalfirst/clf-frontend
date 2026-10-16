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
  {
    label: "Offer Discounts",
    description:
      "Incentivize looky loo's to actually visit your shop with a discount of your choice.",
  },
  {
    label: "Track Analytics",
    description:
      "View interactions with your local supporters in your business dashboard.",
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

const IMG = {
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
    photo: IMG.reach,
    photoRight: true,
    mobilePhotoPosition: "object-[center_8%]",
  },
  {
    heading: ["LET THEM MEET", "THE PERSON", "BEHIND IT"],
    body: "People want to know who they're supporting. Your profile puts a face and a story behind the storefront, so customers feel like they're shopping with a neighbor, not a stranger.",
    photo: IMG.owner,
    photoRight: false,
    mobilePhotoPosition: "object-[center_20%]",
  },
  {
    heading: ["TELL YOUR STORY,", "NOT JUST YOUR", "HOURS"],
    body: "A professional business profile that goes beyond a pin on a map — what makes your business yours, why you started it, and what customers can expect when they walk in.",
    photo: IMG.story,
    photoRight: true,
  },
  {
    heading: ["WE'RE STRONGER", "TOGETHER"],
    body: "Owning a small business can feel overwhelming. Join a community of like-minded business owners who share the goal of lifting each other up to strengthen Reno's local economy.",
    photo: IMG.content,
    photoRight: false,
    mobilePhotoPosition: "object-top",
  },
];

const COPY = {
  heroHeading: "JOIN RENO'S LOCAL-FIRST MOVEMENT",
  heroSubheading: "Become part of the community people trust.",
  introPhotoAlt: "Reno local community",
  whyHeading: "WHY DO BUSINESSES JOIN?",
  whySubheading: "A few reasons local business owners say yes.",
  pricingHeading: "PRICING & PACKAGES",
  pricingSubheading:
    "Every membership includes a directory profile. Choose a tier that fits how visible you want your business to be.",
  pricingCta: "Join Now →",
  community: {
    tier: "COMMUNITY",
  },
  premium: {
    tier: "PREMIUM",
    everythingLine: "Everything in Community",
  },
};

const PRICING_CARDS = {
  community: {
    price: "$19.99",
    tier: COPY.community.tier,
    features: COMMUNITY_FEATURES,
  },
  premium: {
    price: "$49.98",
    tier: COPY.premium.tier,
    extraLine: COPY.premium.everythingLine,
    features: PREMIUM_FEATURES,
  },
};

function PricingCard({
  bg,
  price,
  tier,
  features,
  extraLine,
}: {
  bg: string;
  price: string;
  tier: string;
  features: { label: string; description: string }[];
  extraLine?: string;
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

      {/* Features — tap one to see what it includes */}
      <div className="flex flex-col">
        {extraLine && (
          <p className="font-body text-[14px] text-[#faf6e9] pb-[14px] border-b border-[rgba(250,246,233,0.35)]">
            {extraLine}
          </p>
        )}
        <FeatureAccordion
          features={features}
          labelColor="text-[#faf6e9]"
          descColor="text-[rgba(250,246,233,0.8)]"
          dividerColor="border-[rgba(250,246,233,0.35)]"
          plusColor="text-[#faf6e9]"
        />
      </div>

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
          <Image src={IMG.intro} alt={COPY.introPhotoAlt} fill priority sizes="100vw" className="object-cover" />
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
          {REASONS.map(({ heading, body, photo, photoRight, mobilePhotoPosition }, i) => (
            <div key={i}>
              {/* Mobile: photo → heading → body */}
              <div className="md:hidden flex flex-col gap-[20px]">
                <div className="relative h-[220px] rounded-[4px] overflow-hidden bg-[#c9d2cf]">
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="100vw"
                    className={`object-cover ${mobilePhotoPosition ?? ""}`}
                  />
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

      {/* ── Pricing & Packages ── */}
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

      <Footer />
    </>
  );
}
