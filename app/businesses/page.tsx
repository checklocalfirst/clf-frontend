import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";

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
    body: "Every visitor to Check Local First came here on purpose, looking to shop local. No ads to outbid, no algorithm to beat — just customers who already want to find a business like yours.",
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
    heading: ["GET PHOTOS AND", "CONTENT THAT", "ACTUALLY WORK"],
    body: "Professional photography and custom social content, made to help your business get seen and shared — no need to hire your own photographer or figure out social media alone.",
    photo: PHOTOS.content,
    photoRight: false,
  },
];

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
          JOIN RENO&apos;S LOCAL-FIRST MOVEMENT
        </h1>
        <p className="font-body text-[20px] text-[#423926]">
          Become part of the community people trust.
        </p>
        <div className="hidden md:block bg-[#b7a78c] h-[3px] w-full" />
      </div>

      {/* ── Intro Photo + Text ── */}
      <div className="bg-[#faf6e9] px-[16px] md:px-[64px] pb-[48px] md:pb-[64px] flex flex-col gap-[32px]">
        <div className="relative h-[220px] md:h-[360px] bg-[#c9d2cf] rounded-[4px] overflow-hidden">
          <Image src={PHOTOS.intro} alt="Reno local community" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="flex flex-col md:flex-row gap-[24px] md:gap-[64px] text-[#423926] text-[15px] font-body">
          <p className="flex-1">
            Check Local First is a curated directory connecting people with Reno&apos;s best locally owned
            businesses.
          </p>
          <p className="flex-1">
            People want to support local. We make it easy to discover, trust, and choose businesses like
            yours over national chains.
          </p>
        </div>
      </div>

      {/* ── Why Businesses Join ── */}
      <section className="bg-[#faf6e9] pb-[48px] md:pb-[64px]">
        {/* Section header */}
        <div className="px-[16px] md:px-[64px] pt-[40px] md:pt-[56px] pb-[24px] flex flex-col items-start md:items-center gap-[12px]">
          <h2 className="font-display font-bold text-[24px] md:text-[40px] text-[#423926]">
            WHY BUSINESSES JOIN
          </h2>
          <p className="font-body text-[20px] text-[#423926]">
            A few reasons local business owners say yes.
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
          FOUNDING MEMBER PRICING
        </h2>

        {/* Perks banner */}
        <div className="bg-[#c9d2cf] rounded-[12px] px-[28px] py-[24px] w-full flex flex-col gap-[10px]">
          <p className="font-display font-bold text-[15px] text-[#423926]">
            ✓ 3 months free to start — get listed and get seen before you pay a thing.
          </p>
          <p className="font-display font-bold text-[15px] text-[#423926]">
            ✓ Founding businesses are grandfathered in at 25% off whatever the going rate is, for as
            long as you stay a member.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="flex gap-[40px] w-full max-w-[900px]">
          {/* Community Card */}
          <div className="bg-white rounded-[16px] flex-1 p-[32px] flex flex-col min-h-[328px]">
            <p className="font-display font-bold text-[14px] text-[#b7a78c]">FOUNDING MEMBER</p>
            <div className="flex items-baseline gap-[12px] mt-[32px]">
              <p className="font-display font-bold text-[40px] text-[#151814] leading-none">FREE</p>
              <p className="font-display text-[16px] text-[#b7a78c]">for 3 months</p>
            </div>
            <p className="font-display text-[13px] text-[#b7a78c] mt-[12px]">
              Then $19/month — locked in as your founding rate.
            </p>
            <div className="mt-[20px] flex flex-col gap-[12px]">
              <p className="font-display text-[14px] text-[#151814]">
                ✓ Directory listing — be found by people looking to shop local
              </p>
              <p className="font-display text-[14px] text-[#151814]">
                ✓ &ldquo;Meet the Owner&rdquo; feature — let customers see who they&apos;re supporting
              </p>
              <p className="font-display text-[14px] text-[#151814]">
                ✓ Contact &amp; hours — links to your socials, website, and hours of operation
              </p>
            </div>
          </div>

          {/* Premium Card */}
          <div className="bg-[#2c4a34] rounded-[16px] flex-1 p-[32px] flex flex-col min-h-[319px]">
            <p className="font-display font-bold text-[14px] text-[#e8ebe6]">PREMIUM</p>
            <div className="flex items-baseline gap-[12px] mt-[32px]">
              <p className="font-display font-bold text-[40px] text-white leading-none">$XX</p>
              <p className="font-display text-[16px] text-[#e8ebe6]">/ Month</p>
            </div>
            <p className="font-display font-bold text-[13px] text-white mt-[16px]">
              Everything in Community, plus:
            </p>
            <div className="mt-[12px] flex flex-col gap-[10px]">
              <p className="font-display text-[14px] text-white">✓ Homepage rotation</p>
              <p className="font-display text-[14px] text-white">
                ✓ Featured Business spotlight placement
              </p>
              <p className="font-display text-[14px] text-white">
                ✓ A free consumer account for the owner
              </p>
              <p className="font-display text-[14px] text-white">
                ✓ Expanded scrolling photo gallery on your listing
              </p>
            </div>
          </div>
        </div>

        <p className="font-body text-[13px] text-[#b7a78c] text-center max-w-[516px]">
          Pricing and program details shown here are not final and may change before launch.
        </p>
      </div>

      {/* ── Founding Member Pricing (Mobile) ── */}
      <div className="md:hidden bg-[#faf6e9] px-[16px] pt-[40px] pb-[32px] flex flex-col gap-[20px]">
        <h2 className="font-display font-bold text-[24px] text-[#423926]">
          FOUNDING MEMBER PRICING
        </h2>
        <p className="font-body font-bold text-[15px] text-[#423926]">
          ✓ 3 months free to start — get listed and get seen before you pay a thing.
        </p>
        <p className="font-body font-bold text-[15px] text-[#423926]">
          ✓ Founding businesses are grandfathered in at 25% off whatever the going rate is, for as long
          as you stay a member.
        </p>

        {/* Community Card Mobile */}
        <div className="bg-[#253022] rounded-[16px] p-[24px] flex flex-col gap-[12px]">
          <p className="font-display font-bold text-[14px] text-[#faf6e9]">FOUNDING MEMBER</p>
          <div className="flex items-baseline gap-[10px]">
            <p className="font-display font-bold text-[30px] text-[#faf6e9] leading-none">FREE</p>
            <p className="font-body text-[16px] text-[#faf6e9] opacity-70">for 3 months</p>
          </div>
          <p className="font-body text-[13px] text-[#faf6e9] opacity-60">
            Then $19/month — locked in as your founding rate.
          </p>
          <div className="flex flex-col gap-[10px] mt-[4px]">
            <p className="font-body text-[14px] text-[#faf6e9]">
              ✓ Directory listing — be found by people looking to shop local
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              ✓ &ldquo;Meet the Owner&rdquo; feature — let customers see who they&apos;re supporting
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              ✓ Contact &amp; hours — links to your socials, website, and hours of operation
            </p>
          </div>
        </div>

        {/* Premium Card Mobile */}
        <div className="bg-[#c96f47] rounded-[16px] p-[24px] flex flex-col gap-[12px]">
          <p className="font-display font-bold text-[14px] text-[#faf6e9]">PREMIUM</p>
          <div className="flex items-baseline gap-[10px]">
            <p className="font-display font-bold text-[30px] text-[#faf6e9] leading-none">$XX</p>
            <p className="font-body text-[16px] text-[#faf6e9] opacity-70">/ Month</p>
          </div>
          <p className="font-body text-[13px] text-[#faf6e9] opacity-60">
            Everything in Community, plus:
          </p>
          <div className="flex flex-col gap-[10px] mt-[4px]">
            <p className="font-body text-[14px] text-[#faf6e9]">✓ Homepage rotation</p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              ✓ Featured Business spotlight placement
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              ✓ A free consumer account for the owner
            </p>
            <p className="font-body text-[14px] text-[#faf6e9]">
              ✓ Expanded scrolling photo gallery on your listing
            </p>
          </div>
        </div>

        <p className="font-body text-[13px] text-[#b7a78c]">
          Pricing and program details shown here are not final and may change before launch.
        </p>
      </div>

      {/* ── Pilot Business (Desktop) ── */}
      <div className="hidden md:block bg-[#faf6e9] px-[64px] pb-[48px]">
        <div className="border border-[#bc6239] rounded-[16px] flex items-center gap-[24px] px-[32px] py-[28px]">
          <div className="bg-[#bc6239] rounded-full px-[18px] py-[10px] flex-shrink-0">
            <p className="font-display font-bold text-[13px] text-[#faf6e9]">PILOT BUSINESS</p>
          </div>
          <p className="font-body text-[15px] text-[#423926] flex-1">
            Pilot businesses will always be recognized as part of the original group that helped bring
            Check Local First to life. Your association will help us build credibility with the locals.
          </p>
        </div>
      </div>

      {/* ── Pilot Business (Mobile) ── */}
      <div className="md:hidden mx-[16px] mb-[32px] bg-[#ede5d9] rounded-[12px] p-[20px]">
        <div className="bg-[#253022] rounded-[6px] px-[12px] py-[8px] inline-block mb-[24px]">
          <p className="font-display font-bold text-[11px] text-[#faf6e9]">PILOT BUSINESS</p>
        </div>
        <p className="font-body text-[15px] text-[#423926]">
          Pilot businesses will always be recognized as part of the original group that helped bring
          Check Local First to life. Your association will help us build credibility with the locals.
        </p>
      </div>

      {/* ── Bottom CTA ── */}
      {/* Desktop */}
      <div className="hidden md:flex flex-col items-center justify-center gap-[24px] bg-[#2c4a34] p-[64px]">
        <p className="font-display font-bold text-[32px] text-[#faf6e9] text-center max-w-[900px] leading-tight">
          Starting small, so we can grow the right way. Become a founding business.
        </p>
        <Link
          href="/signup"
          className="bg-[#bc6239] rounded-full px-[32px] py-[16px] font-body font-bold text-[16px] text-[#faf6e9] hover:opacity-90 transition-opacity"
        >
          Become a Founding Business →
        </Link>
      </div>
      {/* Mobile */}
      <div className="md:hidden bg-[#2c4a34] px-[16px] py-[48px] flex flex-col items-center gap-[24px]">
        <p className="font-display font-bold text-[20px] text-[#faf6e9] text-center">
          Starting small, so we can grow the right way. Become a founding business.
        </p>
        <Link
          href="/signup"
          className="bg-[#253022] rounded-[8px] h-[52px] w-full flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <span className="font-display font-bold text-[14px] text-[#faf6e9]">
            BECOME A FOUNDING BUSINESS →
          </span>
        </Link>
      </div>

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
