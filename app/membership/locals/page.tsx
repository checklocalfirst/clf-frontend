import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import JoinNowLink from "@/components/JoinNowLink";

export const metadata: Metadata = {
  title: "Membership for Locals",
  description:
    "Join Check Local First as a Premium member — redeem exclusive discount codes at participating businesses and support independent shops around Reno.",
  alternates: { canonical: "/membership/locals" },
};

const REASONS = [
  {
    heading: ["KEEP YOUR", "MONEY CLOSE", "TO HOME"],
    body: "You have the power to create change with every dollar you spend. When you spend locally, not only are you supporting your community, but you are reinvesting in a brighter future for Reno.",
    photoRight: true,
  },
  {
    heading: ["CARE ABOUT CRAFTSMANSHIP"],
    body: "Behind every listing is someone who has spent years getting good at what they do — a baker who wakes before the sun, a shop owner who remembers your name, a farmer whose family has been growing for generations.",
    photoRight: false,
  },
  {
    heading: ["CHOOSE", "CONNECTION OVER", "CONVENIENCE"],
    body: "We've traded in the everyday joy of a meaningful exchange for free two-day shipping. Human connection is invaluable. Choose intentional moments with real people, and you'll see the difference.",
    photoRight: true,
  },
  {
    heading: ["WE ARE REAL PEOPLE"],
    body: "Your choice to support a neighbor puts food on the table for their families, pays their rent, and keeps the lights on in their shop. These are the people that keep Reno unique.",
    photoRight: false,
  },
];

export default function LocalsMembershipPage() {
  return (
    <>
      <Header />

      {/* ── Search Bar Row ── */}
      <div className="bg-[#faf6e9] border-b border-[#dbe0d9] flex justify-center items-center h-[78px] px-5 md:h-[112px]">
        <SearchBar className="w-full md:w-[880px]" />
      </div>

      {/* ── Hero ── */}
      <section className="relative h-[420px] md:h-[640px] w-full overflow-hidden">
        <Image src="/placeholder.png" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="font-display font-bold text-[28px] md:text-[48px] text-[#faf6e9] leading-tight md:leading-none max-w-[900px]">
            Shopping local, made easy
          </p>
          <JoinNowLink className="bg-[#bc6239] rounded-full px-7 py-[14px] md:px-9 md:py-[18px] font-display font-bold text-[13px] md:text-[16px] text-[#faf6e9] uppercase hover:opacity-90 transition-opacity">
            Start Your Membership
          </JoinNowLink>
        </div>
      </section>

      {/* ── How Membership Works ── */}
      <section className="bg-[#faf6e9] flex flex-col items-center gap-6 md:gap-8 px-5 md:px-[64px] pt-8 md:pt-4 pb-10 md:pb-16">
        <h2 className="font-display font-bold text-[24px] md:text-[40px] text-[#423926] text-center">
          HOW MEMBERSHIP WORKS
        </h2>
        <div className="bg-[#c9d2cf] rounded-[12px] px-6 py-5 md:px-7 md:py-6 w-full flex flex-col gap-3 md:gap-[10px]">
          <p className="font-body text-[15px] md:text-[24px] text-[#423926] leading-[1.4]">
            Browsing the directory and saving your favorite businesses is always free.
          </p>
          <p className="font-body text-[15px] md:text-[24px] text-[#423926] leading-[1.4]">
            Upgrade to a membership and unlock discounts at every single business across the directory.
          </p>
        </div>
      </section>

      {/* ── Why Section Header ── */}
      <section className="bg-[#faf6e9] flex flex-col items-center gap-3 text-center px-5 md:px-[64px] pt-2 md:pt-10 pb-6">
        <h2 className="font-display font-bold text-[24px] md:text-[40px] text-[#423926]">
          WHY CHECK LOCAL FIRST?
        </h2>
        <p className="font-body text-[15px] md:text-[20px] text-[#423926] max-w-[424px]">
          A few reasons our members join the community, and choose to stay.
        </p>
      </section>

      {/* ── Reason Splits ── */}
      <section className="flex flex-col gap-10 md:gap-0 px-5 md:px-0">
        {REASONS.map(({ heading, body, photoRight }, i) => (
          <div key={i}>
            {/* Mobile: photo → heading → body */}
            <div className="md:hidden flex flex-col gap-5">
              <div className="relative h-[220px] rounded-[4px] overflow-hidden bg-[#c9d2cf]">
                <Image src="/placeholder.png" alt="" fill sizes="100vw" className="object-cover" />
              </div>
              <div className="font-display font-bold text-[22px] text-[#423926] tracking-[-1px]">
                {heading.map((line, j) => (
                  <p key={j} className="leading-[1.1]">
                    {line}
                  </p>
                ))}
              </div>
              <p className="font-body text-[15px] text-[#423926] leading-[1.6]">{body}</p>
            </div>

            {/* Desktop: text + photo, alternating sides */}
            <div className="hidden md:flex h-[620px]">
              {!photoRight && (
                <div className="relative w-1/2 h-full bg-[#c9d2cf] overflow-hidden flex-shrink-0">
                  <Image src="/placeholder.png" alt="" fill sizes="50vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-col gap-5 justify-center w-1/2 px-[72px]">
                <div className="font-display font-bold text-[40px] text-[#423926] tracking-[-1px] max-w-[576px]">
                  {heading.map((line, j) => (
                    <p key={j} className="leading-[1.05]">
                      {line}
                    </p>
                  ))}
                </div>
                <p className="font-body text-[20px] text-[#423926] leading-[1.6] max-w-[576px]">{body}</p>
              </div>
              {photoRight && (
                <div className="relative w-1/2 h-full bg-[#c9d2cf] overflow-hidden flex-shrink-0">
                  <Image src="/placeholder.png" alt="" fill sizes="50vw" className="object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── Divider ── */}
      <div className="px-5 md:px-[64px] pt-10 md:pt-2">
        <div className="h-px bg-[#b7a78c] w-full" />
      </div>

      {/* ── Just The Beginning ── */}
      <section className="bg-[#faf6e9] flex flex-col items-center gap-4 text-center px-5 md:px-[64px] pt-8 md:pt-4 pb-10 md:pb-14">
        <h2 className="font-display font-bold text-[22px] md:text-[40px] text-[#423926] leading-tight max-w-[872px]">
          CHOOSE INTENTIONALLY. CHOOSE THE RENO YOU WANT TO KEEP.
        </h2>
        <p className="font-body text-[15px] md:text-[20px] text-[#423926] leading-[1.6] max-w-[680px]">
          Check Local First is just getting started, and so is Reno&apos;s local-first movement. We&apos;re
          learning as we grow, listening to the businesses and neighbors who make this community what it
          is. Good things take time, and we&apos;re building this the right way, one member at a time.
        </p>
      </section>

      {/* ── Membership Pricing ── */}
      <section className="bg-[#faf6e9] flex flex-col items-center gap-8 px-5 md:px-[64px] pt-2 md:pt-4 pb-14 md:pb-24">
        <h2 className="font-display font-bold text-[24px] md:text-[40px] text-[#423926] text-center">
          INVEST IN YOUR COMMUNITY
        </h2>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-[812px]">
          {/* Community Card */}
          <div className="bg-[#c9d2cf] rounded-[20px] flex-1 px-7 py-8 flex flex-col gap-3">
            <p className="font-display font-bold text-[20px] md:text-[24px] text-[#423926]">
              JOIN THE COMMUNITY
            </p>
            <div className="flex items-baseline gap-1">
              <p className="font-display font-bold text-[28px] text-[#423926] leading-none">$0</p>
              <p className="font-body text-[14px] text-[#423926]">/ Month</p>
            </div>
            <p className="font-body text-[15px] md:text-[20px] text-[#423926] leading-[1.5]">
              Browse the directory, save favorites, and get introduced to your next favorite business.
            </p>
          </div>

          {/* Local Insider Card */}
          <div className="bg-[#9ca889] rounded-[20px] flex-1 px-7 py-8 flex flex-col gap-3">
            <p className="font-display font-bold text-[20px] md:text-[24px] text-[#faf6e9]">
              BECOME A MEMBER
            </p>
            <div className="flex items-baseline gap-1">
              <p className="font-display font-bold text-[28px] text-[#faf6e9] leading-none">$10</p>
              <p className="font-body text-[14px] text-[#faf6e9]">/ Month</p>
            </div>
            <p className="font-body text-[15px] md:text-[20px] text-[#faf6e9] leading-[1.5]">
              Every participating business offers an exclusive discount for our members.
            </p>
          </div>
        </div>

        <JoinNowLink className="bg-[#bc6239] rounded-full px-8 py-4 font-body font-bold text-[15px] md:text-[16px] text-[#faf6e9] hover:opacity-90 transition-opacity">
          Become a Founding Member →
        </JoinNowLink>
      </section>

      <Footer />
    </>
  );
}
