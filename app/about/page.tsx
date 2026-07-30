import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

const IMG = {
  /* Desktop grid photos */
  grid1: "https://www.figma.com/api/mcp/asset/6eadd532-72d3-4f9b-9690-655d54ef9ea3",
  grid2: "https://www.figma.com/api/mcp/asset/b9028f89-db2a-4954-b0ff-11e91f4cf6a3",
  grid3: "https://www.figma.com/api/mcp/asset/687282b6-510a-4976-8596-b96e89662334",
/* Mobile mosaic photos */
  mosaic1: "https://www.figma.com/api/mcp/asset/97d7c3d1-e7de-4cf5-be57-e034be23b7f5",
  mosaic2: "https://www.figma.com/api/mcp/asset/5eb0f720-5005-4931-9f73-a09a6e713216",
  mosaic3: "https://www.figma.com/api/mcp/asset/e7d72d30-7d47-4779-9da7-02d5ab93d932",
  founder: "/market.JPG",
};

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Search bar row — desktop: centered 880px | mobile: 20px margins */}
      <div className="bg-[#faf6e9] border-b border-[#dbe0d9] flex justify-center px-5 py-[14px] md:py-6">
        <SearchBar className="w-full md:w-[880px]" />
      </div>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}

      {/* Desktop */}
      <section className="hidden md:flex items-center justify-center bg-[#faf6e9] px-[180px] min-h-[251px] py-12">
        <div className="flex flex-col gap-6 items-center text-center w-full">
          <h1 className="font-display font-bold text-[64px] text-[#151814] uppercase leading-[1.1]">
            THE CHECK LOCAL FIRST STORY
          </h1>
          <p className="font-display text-[20px] text-[#151814] leading-[1.6]">
            Check Local First started with a simple frustration: it shouldn&apos;t be this hard to find and support the businesses that make Reno feel like home.
          </p>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col gap-5 items-center text-center pt-[44px] pb-[52px] px-[28px]">
        <p className="font-display font-bold text-[9px] text-[#b7a78c] tracking-[3px] uppercase w-full">
          Our story
        </p>
        <h1 className="font-display font-bold text-[34px] text-[#151814] uppercase tracking-[0.5px] leading-[42px] w-full">
          The Check<br />Local First<br />Story
        </h1>
        <p className="font-body text-[12px] text-[#596155] leading-[22px] w-full">
          Check Local First started with a simple frustration: it shouldn&apos;t be this hard to find and support the businesses that make Reno feel like home.
        </p>
      </section>

      {/* ════════════════════════════════
          GRID — desktop only
      ════════════════════════════════ */}
      <section className="hidden md:grid grid-cols-3">
        {/* Row 1: dark card | photo | dark card */}
        <div className="bg-[#423926] flex flex-col justify-between p-10 h-[440px]">
          <div className="flex flex-col gap-4">
            <p className="font-display font-bold text-[20px] text-white/55 uppercase">DOES THIS SOUND FAMILIAR?</p>
            <p className="font-display text-[20px] text-[#f0edd8] leading-[1.3]">
              I want to shop local, but my options feel limited, so I default to a chain because it&apos;s just easier to find.
            </p>
          </div>
          <div className="flex justify-end">
            <span className="font-display text-[20px] text-[#423926]">→</span>
          </div>
        </div>
        <div className="relative overflow-hidden h-[440px]">
          <img src={IMG.grid1} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="bg-[#423926] flex flex-col justify-between p-10 h-[440px]">
          <div className="flex flex-col gap-4">
            <p className="font-display font-bold text-[20px] text-white/55 uppercase">DOES THIS SOUND FAMILIAR?</p>
            <p className="font-display text-[20px] text-[#f0edd8] leading-[1.3]">
              I&apos;d love to support local businesses, but I don&apos;t know what&apos;s out there — finding them feels like extra work.
            </p>
          </div>
          <div className="flex justify-end">
            <span className="font-display text-[20px] text-[#423926]">→</span>
          </div>
        </div>

        {/* Row 2: photo | dark card | photo */}
        <div className="relative overflow-hidden h-[440px]">
          <img src={IMG.grid2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="bg-[#423926] flex flex-col justify-between p-10 h-[440px]">
          <p className="font-display text-[20px] text-[#f0edd8] leading-[1.3]">
            Search engines are full of ads and chains. I just want an easy way to find real local spots I can trust.
          </p>
          <div className="flex justify-end">
            <span className="font-display text-[20px] text-[#b5c98a]">→</span>
          </div>
        </div>
        <div className="relative overflow-hidden h-[440px]">
          <img src={IMG.grid3} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>

      </section>

      {/* ════════════════════════════════
          MOSAIC — mobile only
      ════════════════════════════════ */}
      <section className="md:hidden flex flex-col">
        <div className="bg-[#2c4a34] flex flex-col gap-5 pt-[48px] pb-[52px] px-[32px]">
          <p className="font-display font-bold text-[9px] text-[#b5c98a] tracking-[2.4px] uppercase">Does this sound familiar?</p>
          <p className="font-body text-[15px] text-[#faf6e9] leading-[26px]">
            &ldquo;I want to shop local, but my options feel limited — so I default to a chain because it&apos;s just easier to find.&rdquo;
          </p>
          <p className="font-display font-bold text-[15px] text-[#faf6e9] text-right">→</p>
        </div>
        <div className="relative h-[320px] overflow-hidden">
          <img src={IMG.mosaic1} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="bg-[#423926] flex flex-col gap-5 pt-[48px] pb-[52px] px-[32px]">
          <p className="font-display font-bold text-[9px] text-[#e6d0a4] tracking-[2.4px] uppercase">Does this sound familiar?</p>
          <p className="font-body text-[15px] text-[#faf6e9] leading-[26px]">
            &ldquo;I&apos;d love to support local businesses, but I don&apos;t know what&apos;s out there — finding them feels like extra work.&rdquo;
          </p>
          <p className="font-display font-bold text-[15px] text-[#faf6e9] text-right">→</p>
        </div>
        <div className="relative h-[320px] overflow-hidden">
          <img src={IMG.mosaic2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="bg-[#9ca889] flex flex-col gap-5 pt-[48px] pb-[52px] px-[32px]">
          <p className="font-display font-bold text-[9px] text-[#253022] tracking-[2.4px] uppercase">Does this sound familiar?</p>
          <p className="font-body text-[15px] text-[#151814] leading-[26px]">
            &ldquo;Search engines are full of ads and chains. I just want an easy way to find real local spots I can trust.&rdquo;
          </p>
          <p className="font-display font-bold text-[15px] text-[#151814] text-right">→</p>
        </div>
        <div className="relative h-[320px] overflow-hidden">
          <img src={IMG.mosaic3} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      {/* ════════════════════════════════
          BOTTOM — desktop only
      ════════════════════════════════ */}
      <section className="hidden md:flex flex-col items-center gap-12 bg-[#faf6e9] px-[280px] py-[120px]">
        {/* Narrative paragraphs */}
        <div className="flex flex-col gap-7 items-center text-center w-full">
          <p className="font-body text-[20px] text-[#151814] leading-[1.7]">
            Everyone wants to shop locally - but it&apos;s not always easy. Check Local First makes it convenient to find, support, and invest in the local businesses that make our community what it is. When shopping local is simple, people do more of it, and the whole community is better for it.
          </p>
          <p className="font-display text-[20px] text-[#151814] leading-[1.7]">
            So we built Check Local First to fix exactly that: one place to actually find the local businesses in Reno, without wading through ads, chains, or guesswork.
          </p>
          <p className="font-display text-[20px] text-[#151814] leading-[1.7]">
            Real people, real places, real stories — every purchase here is a small reinvestment in the neighbors, makers, and small businesses that make this city ours. When you join, you&apos;re not just signing up — you&apos;re becoming part of a community that chooses local first.
          </p>
        </div>

        {/* Founder block */}
        <div className="flex flex-col gap-8 w-full">
          <p className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-widest">MEET THE FOUNDER</p>
          <div className="relative h-[480px] w-full rounded-[12px] overflow-hidden">
            <img src={IMG.founder} alt="Tessa Miller, Founder" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <h2 className="font-display font-bold text-[32px] text-[#151814]">Tessa&apos;s Story</h2>
          <div className="flex flex-col gap-6">
            <p className="font-display text-[18px] text-[#151814] leading-relaxed">
              Every day I get to spend my time on the thing I love most about Reno: the people who make it. I wear a lot of hats around here — website builder, photographer, social media person, occasional delivery driver — but before any of that, I was just someone who really liked knowing where to find things.
            </p>
            <p className="font-display text-[18px] text-[#151814] leading-relaxed">
              I grew up here. I know the potter who fires her own glazes in her garage, the family who&apos;s run the same corner bakery for twenty years, the shop that sources vintage denim nobody else carries. And for years, people kept finding their way to me asking the same question: &ldquo;where do you find this stuff?&rdquo; Friends. Neighbors. Total strangers at the farmers market.
            </p>
            <p className="font-display text-[18px] text-[#151814] leading-relaxed">
              At some point I realized I was basically running an unofficial, unpaid concierge service out of my group chats. So I did what any reasonable person does when a problem won&apos;t leave them alone — I gathered a small team of interns, some coffee, and way too many spreadsheets, and we built Check Local First from scratch.
            </p>
            <p className="font-display text-[18px] text-[#151814] leading-relaxed">
              It&apos;s not a big company. It&apos;s a handful of people who care about the same thing: making it easier for this city to support itself. Every business on this site is here because someone who loves this place vouched for it. That&apos;s the whole idea.
            </p>
            <p className="font-display text-[18px] text-[#151814] leading-relaxed">
              We still have a long way to go, but I&apos;m proud of what we&apos;re building — and even more grateful for everyone who&apos;s chosen to be part of it.
            </p>
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
      </section>

      {/* ════════════════════════════════
          NARRATIVE — mobile only
      ════════════════════════════════ */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col gap-6 items-center text-center pt-[56px] pb-[48px] px-[28px]">
        <p className="font-body text-[12px] text-[#596155] leading-[22px] w-full">
          Everyone wants to shop locally — but it&apos;s not always easy. Check Local First makes it convenient to find, support, and invest in the businesses that make our community what it is.
        </p>
        <p className="font-body text-[12px] text-[#596155] leading-[22px] w-full">
          So we built Check Local First to fix exactly that: one place to actually find the local businesses in Reno, without wading through ads, chains, or guesswork.
        </p>
        <p className="font-body text-[12px] text-[#596155] leading-[22px] w-full">
          Real people, real places, real stories. Every purchase here is a small reinvestment in the neighbors, makers, and small businesses that make this city ours.
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
          <img src={IMG.founder} alt="Tessa Miller, Founder" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-[18px] pt-[36px] pb-[52px] px-[28px]">
          <h2 className="font-display font-bold text-[24px] text-[#253022] uppercase tracking-[0.5px] leading-[30px]">
            Tessa&apos;s Story
          </h2>
          <p className="font-body text-[12px] text-[#423926] leading-[22px]">
            Every day I get to spend my time on the thing I love most about Reno: the people who make it. I wear a lot of hats around here — website builder, photographer, social media person, occasional delivery driver — but before any of that, I was just someone who really liked knowing where to find things.
          </p>
          <p className="font-body text-[12px] text-[#423926] leading-[22px]">
            I grew up here. I know the potter who fires her own glazes in her garage, the family who&apos;s run the same corner bakery for twenty years, the shop that sources vintage denim nobody else carries. And for years, people kept finding their way to me asking the same question: &ldquo;where do you find this stuff?&rdquo;
          </p>
          <p className="font-body text-[12px] text-[#423926] leading-[22px]">
            At some point I realized I was basically running an unofficial, unpaid concierge service out of my group chats. So I did what any reasonable person does when a problem won&apos;t leave them alone — I gathered a small team of interns, some coffee, and way too many spreadsheets, and we built Check Local First from scratch.
          </p>
          <p className="font-body text-[12px] text-[#423926] leading-[22px]">
            It&apos;s not a big company. It&apos;s a handful of people who care about the same thing: making it easier for this city to support itself. Every business on this site is here because someone who loves this place vouched for it. That&apos;s the whole idea.
          </p>
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
      </section>

      <Footer />
    </>
  );
}
