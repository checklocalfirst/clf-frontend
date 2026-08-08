import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Check Local First — why we built a directory dedicated to helping Reno shoppers find and support independently owned businesses.",
  alternates: { canonical: "/about" },
};

// Same five placeholders used on both breakpoints — desktop lays them out in a row,
// mobile in a horizontally-scrolling strip.
const STORY_PHOTOS = ["/placeholder.png", "/placeholder.png", "/placeholder.png", "/placeholder.png", "/placeholder.png"];

const IMG = {
  founder: "/market.JPG",
};

const STORY_PARAGRAPHS = [
  "Everyone wants to shop locally - but it's not always easy. Check Local First makes it convenient to find, support, and invest in the local businesses that make our community what it is. When shopping local is simple, people do more of it, and the whole community is better for it.",
  "So we built Check Local First to fix exactly that: one place to actually find the local businesses in Reno, without wading through ads, chains, or guesswork.",
  "Real people, real places, real stories — every purchase here is a small reinvestment in the neighbors, makers, and small businesses that make this city ours. When you join, you're not just signing up — you're becoming part of a community that chooses local first.",
];

const FOUNDER_PARAGRAPHS = [
  "Call me a crazy optimist, but I believe a lot of the world's problems can be solved by shifting our focus to our local communities.",
  "My name is Tessa and I own the Nest, a vintage boutique right here in Reno. I've been in business in this area for over 20 years now. In that time, I've seen us go from looking up mom and pop businesses in the phone book and going to them in the flesh to getting cheap crap delivered to our doors through online shopping.",
  "I started Check Local First after receiving a ton of positive feedback from creating a local holiday shopping guide called the Reno Nice List. As depressed as I get at the state of the world and humanity sometimes, I got a boost from realizing that there are a lot of people out there who want to shop small and local and support their neighbors instead of greedy billionaires.",
  "Friends began to constantly text asking where they could get toilet brushes and non-toxic hand soap and all sorts of random necessities locally. And I would oblige, but it got me thinking that if we had a resource where you could search for these things, then people would be more likely to shop small and local.",
  "The thing is, we've been thoroughly programmed that convenience is king and cheap items save us money. (I could write essays about how that's not true, but we won't get into that here…) And undoing this programming and its subsequent habits is no small feat. But every journey starts with one small step.",
  "It has become hard to argue with the luxury of perceived convenience these days. That's why I thought if we could make a searchable directory of trusted local businesses, then it would be easier to Check Local First before sending our hard earned money out of the community to line the pockets of a handful of billionaires.",
  "This has been a true labor of love. As a single mom small business owner, an undertaking like this is no small feat. But I keep seeing my fellow business owner friends go out of business, and things are getting tougher and tougher in my business.",
  "I believe so strongly in this, and I am not the type to go down without a fight. Supporting small businesses and my local community isn't just a schtick for me. It's a way of life.",
  "I hope you'll join me in committing to Check Local First. For ourselves. For our neighbors. For Reno.",
];

const JOIN_SNIPPET =
  "If you're here, it's because you believe a city is made of its small businesses, not its chains. We're just trying to make it a little easier to find them.";

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Search bar row — desktop: centered 880px | mobile: 20px margins */}
      <div className="bg-[#faf6e9] border-b border-[#dbe0d9] flex justify-center px-5 py-[14px] md:py-6">
        <SearchBar className="w-full md:w-[880px]" />
      </div>

      {/* ════════════════════════════════
          STORY — heading, narrative, photo row
      ════════════════════════════════ */}

      {/* Desktop */}
      <section className="hidden md:flex flex-col items-center bg-[#faf6e9] px-[180px] pt-16 pb-[64px]">
        <h1 className="font-display font-bold text-[64px] text-[#151814] uppercase leading-[1.1] text-center mb-10">
          THE CHECK LOCAL FIRST STORY
        </h1>
        <div className="flex flex-col gap-7 items-center text-center max-w-[820px] mb-12">
          {STORY_PARAGRAPHS.map((p) => (
            <p key={p} className="font-body text-[18px] text-[#151814] leading-[1.7]">
              {p}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4 w-full">
          {STORY_PHOTOS.map((src, i) => (
            <div key={i} className="relative h-[280px] rounded-[4px] overflow-hidden">
              <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col gap-5 items-center text-center pt-[44px] pb-[36px] px-[28px]">
        <p className="font-display font-bold text-[9px] text-[#b7a78c] tracking-[3px] uppercase w-full">
          Our story
        </p>
        <h1 className="font-display font-bold text-[34px] text-[#151814] uppercase tracking-[0.5px] leading-[42px] w-full">
          The Check<br />Local First<br />Story
        </h1>
        <div className="flex flex-col gap-5 w-full">
          {STORY_PARAGRAPHS.map((p) => (
            <p key={p} className="font-body text-[12px] text-[#596155] leading-[22px] w-full">
              {p}
            </p>
          ))}
        </div>
      </section>
      <section className="md:hidden flex gap-3 overflow-x-auto px-[28px] pb-[52px] scrollbar-none">
        {STORY_PHOTOS.map((src, i) => (
          <div key={i} className="relative w-[120px] h-[140px] flex-shrink-0 rounded-[4px] overflow-hidden">
            <Image src={src} alt="" fill sizes="120px" className="object-cover" />
          </div>
        ))}
      </section>

      {/* ════════════════════════════════
          BOTTOM — desktop only
      ════════════════════════════════ */}
      <section className="hidden md:flex flex-col items-center gap-12 bg-[#faf6e9] px-[280px] py-[120px]">
        {/* Founder block */}
        <div className="flex flex-col gap-8 w-full">
          <p className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-widest">MEET THE FOUNDER</p>
          <div className="relative h-[480px] w-full rounded-[12px] overflow-hidden">
            <Image src={IMG.founder} alt="Tessa Miller, Founder" fill sizes="100vw" className="object-cover" />
          </div>
          <h2 className="font-display font-bold text-[32px] text-[#151814]">Tessa&apos;s Story</h2>
          <div className="flex flex-col gap-6">
            {FOUNDER_PARAGRAPHS.map((p) => (
              <p key={p} className="font-display text-[18px] text-[#151814] leading-relaxed">
                {p}
              </p>
            ))}
            <div className="font-body italic text-[18px] text-[#151814] leading-relaxed">
              <p>With gratitude,</p>
              <p>Tessa Miller, Founder</p>
            </div>
          </div>
        </div>

        <Link
          href="/signup"
          className="bg-[#2c3b2a] text-[#f0edd8] font-display font-bold text-[20px] uppercase px-12 py-5 rounded-[2px] hover:opacity-90 transition-opacity"
        >
          JOIN THE COMMUNITY
        </Link>

        <p className="font-body text-[16px] text-[#596155] leading-[1.7] text-center max-w-[640px]">
          {JOIN_SNIPPET}
        </p>
      </section>

      {/* ════════════════════════════════
          FOUNDER BLOCK — mobile only
      ════════════════════════════════ */}
      <section className="md:hidden bg-[#f4f3ee] flex flex-col">
        <div className="flex items-center justify-center pt-[52px] pb-[22px] px-[28px]">
          <p className="font-display font-bold text-[9px] text-[#b7a78c] tracking-[3px] uppercase text-center w-full">
            Meet the founder
          </p>
        </div>
        <div className="relative h-[380px] w-full flex-shrink-0 overflow-hidden">
          <Image src={IMG.founder} alt="Tessa Miller, Founder" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-[18px] pt-[36px] pb-[52px] px-[28px]">
          <h2 className="font-display font-bold text-[24px] text-[#253022] uppercase tracking-[0.5px] leading-[30px]">
            Tessa&apos;s Story
          </h2>
          {FOUNDER_PARAGRAPHS.map((p) => (
            <p key={p} className="font-body text-[12px] text-[#423926] leading-[22px]">
              {p}
            </p>
          ))}
          <div className="font-body italic text-[12px] text-[#596155] leading-[22px]">
            <p>With gratitude,</p>
            <p>Tessa Miller, Founder</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          JOIN CTA — mobile only
      ════════════════════════════════ */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col items-center gap-[22px] pt-[56px] pb-[64px] px-[28px]">
        <h2 className="font-display font-bold text-[18px] text-[#253022] uppercase tracking-[0.5px] leading-[26px] text-center">
          Come find your people
        </h2>
        <Link
          href="/signup"
          className="bg-[#151814] text-[#faf6e9] font-display font-bold text-[10px] tracking-[1.8px] uppercase px-[30px] py-4 rounded-[2px] hover:opacity-90 transition-opacity"
        >
          Join the community
        </Link>
        <p className="font-body text-[12px] text-[#596155] leading-[22px] text-center">
          {JOIN_SNIPPET}
        </p>
      </section>

      <Footer />
    </>
  );
}
