import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FollowCarousel from "@/components/FollowCarousel";
import NeighborsCarousel from "@/components/NeighborsCarousel";

/* ─────────────────────────────────────────────
   Figma image assets — 7-day URLs.
   Replace with /public files for production.
───────────────────────────────────────────── */
const IMG = {
  heroDesktop:     "https://www.figma.com/api/mcp/asset/0ff119f2-28ed-4a2e-b274-ae1b120a003b",
  wordmarkDesktop: "https://www.figma.com/api/mcp/asset/32d3748f-f938-437a-9218-3c8375382660",
  heroMobile:      "https://www.figma.com/api/mcp/asset/b1157f7d-5441-4f52-a6d4-855b00c1f5f8",
  wordmarkMobile:  "https://www.figma.com/api/mcp/asset/d338f53e-a458-48f6-bf2e-ed36c4aa1e68",
  aboutMobile:     "https://www.figma.com/api/mcp/asset/3f3fcc43-9c32-4a09-b6f6-ee9cd1fdfa26",
  featuredPhoto:   "https://www.figma.com/api/mcp/asset/c2feba24-46cc-41d1-b134-0cd99b0b5961",
  card1:           "https://www.figma.com/api/mcp/asset/38609162-eb44-4acf-a350-9bf0995dd3e4",
  card2:           "https://www.figma.com/api/mcp/asset/574c1b7d-d6b7-45e4-8867-ce80fc90955e",
  card3:           "https://www.figma.com/api/mcp/asset/c09a48fd-807b-4d1a-bf35-37048efcfbf4",
  ig1:             "/breadcompany.JPG",
  ig2:             "/farmers1.JPG",
  ig3:             "/modestmix.JPG",
  ig4:             "/sasquatchsnacks.jpg",
};

const BUSINESSES = [
  { category: "Refill · Zero Waste",  name: "The White Line Shop",  neighborhood: "Wells Avenue",  description: "Eco-friendly household goods and a low-waste refill pantry.", img: IMG.card1, href: "/businesses/white-line-shop" },
  { category: "Vintage · Home",        name: "The Nest",             neighborhood: "Midtown",        description: "Mid-century furniture, vintage textiles, and eccentric finds.", img: IMG.card2, href: "/businesses/the-nest" },
  { category: "Garden · Nursery",      name: "Sierra Water Gardens", neighborhood: "Dickerson Road", description: "Rare succulents, terrariums, and clay pots along the river.", img: IMG.card3, href: "/businesses/sierra-water-gardens" },
  { category: "Bakery · Coffee",       name: "Perenn Bakery",        neighborhood: "Riverside",      description: "Naturally leavened breads, seasonal pastries, and coffee roasted with care.", img: "/breadcompany.JPG", href: "/businesses/perenn-bakery" },
];

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

export default function HomePage() {
  return (
    <>
      <Header />

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}

      {/* Desktop */}
      <section className="hidden md:block relative h-[620px] w-full overflow-hidden bg-[#faf6e9]">
        <img src={IMG.heroDesktop} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45 pointer-events-none" />

        {/* Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[383px] h-[270px]">
          <img src={IMG.wordmarkDesktop} alt="Check Local First" className="w-full h-full object-contain" />
        </div>

        {/* Tagline */}
        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[1029px] text-center font-display font-bold text-[40px] text-[#faf6e9]">
          Your guide to local shopping in Reno, NV
        </p>

        {/* Search bar */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[880px]">
          <SearchBar className="h-[64px]" />
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden relative h-[560px] w-full flex flex-col items-center justify-center gap-7 px-[26px] overflow-hidden">
        <img src={IMG.heroMobile} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[rgba(21,24,20,0.36)] pointer-events-none" />

        <div className="relative w-[288px] h-[203px]">
          <img src={IMG.wordmarkMobile} alt="Check Local First" className="w-full h-full object-contain" />
        </div>

        <div className="relative w-full flex items-center bg-white rounded-[4px] overflow-hidden h-[50px] px-[14px] gap-[10px]">
          <svg className="flex-shrink-0 w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#596155" strokeWidth="1.4" />
            <path d="M11 11L14.5 14.5" stroke="#596155" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="flex-1 font-body text-[11px] text-[#596155]">Search businesses, food &amp; more...</span>
          <button className="bg-[#2c4a34] flex items-center justify-center rounded-[3px] w-[38px] h-[38px] flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.6" />
              <path d="M13 13L16.5 16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="relative font-body text-[12px] text-[#f0edd8] text-center leading-5">
          Your guide to local shopping in Reno, NV
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
          Start Exploring
        </h2>
        {/* Mobile */}
        <p className="md:hidden font-body text-[12px] text-[#596155] leading-[22px] w-full">
          Check Local First is Reno&apos;s local directory. Browse by category or search for exactly what you need, then save the places you want to come back to.
        </p>
        {/* Desktop */}
        <p className="hidden md:block font-body text-[20px] text-[#596155] leading-[1.6] w-full">
          Check Local First is Reno&apos;s local directory, browse by category or search for exactly what you need, save the places you love, and discover the independently owned shops that make this city what it is.
          <br /><br />
          Sign up to join a community that keeps Reno&apos;s money in Reno, while unlocking exclusive member discounts along the way.
        </p>
      </section>

      {/* ════════════════════════════════
          MEET YOUR NEIGHBORS
      ════════════════════════════════ */}

      <NeighborsCarousel businesses={BUSINESSES} />

      {/* ════════════════════════════════
          ABOUT US
      ════════════════════════════════ */}

      {/* Mobile */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col pb-[56px]">
        <div className="relative h-[320px] w-full overflow-hidden">
          <img src={IMG.aboutMobile} alt="About Check Local First" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-4 items-center text-center pt-11 px-[30px]">
          <p className="font-display font-bold text-[9px] text-[#b7a78c] tracking-[3px] uppercase w-full">About us</p>
          <h2 className="font-display font-bold text-[24px] text-[#253022] leading-[32px] w-full">Every dollar is a vote</h2>
          <p className="font-body text-[12px] text-[#596155] leading-[22px] w-full">
            Check Local First started with a simple idea: every dollar spent at a local business is a vote for the kind of city you want to live in. Every listing here is here because someone who loves this place vouched for it.
          </p>
          <Link href="/about" className="font-display font-bold text-[10px] text-[#253022] tracking-[1.6px] uppercase underline w-full">
            Learn more about our story
          </Link>
        </div>
      </section>

      {/* Desktop */}
      <section className="hidden md:flex items-center gap-20 bg-[#faf6e9] px-20 py-[120px]">
        <div className="shadow-[-4px_12px_16px_rgba(37,48,34,0.08)] rounded-[4px] p-6 flex-shrink-0 w-[440px] overflow-hidden">
          <div className="relative h-[360px] w-full rounded-[2px] overflow-hidden">
            <img src="/market.JPG" alt="About Check Local First" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col gap-8 flex-1">
          <h2 className="font-display font-bold text-[64px] text-[#151814] uppercase leading-none">About Us</h2>
          <div className="bg-[#f4f3ee] border border-[#dbe0d9] rounded-[16px] p-10 flex flex-col gap-6">
            <p className="font-body text-[20px] text-[#151814] leading-[1.6]">
              Check Local First started with a simple idea: every dollar spent at a local business is a vote for the kind of community we want to live in. We built this directory to make it effortless to find, support, and celebrate the small businesses that make Reno the Biggest Little City — and to keep neighbors connected to the people behind the counter.
            </p>
            <Link href="/about" className="font-display font-bold text-[20px] text-[#253022] uppercase underline flex items-center gap-2 hover:opacity-70 transition-opacity">
              Learn More About Our Story <ChevronRight color="#253022" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURED BUSINESS — THE NEST
      ════════════════════════════════ */}

      {/* Mobile */}
      <section className="md:hidden bg-[#d9d1c7] flex flex-col">
        <div className="flex flex-col gap-[14px] items-center text-center pt-[56px] pb-6 px-[30px]">
          <p className="font-display font-bold text-[9px] text-[#6b7d67] tracking-[3px] uppercase w-full">Featured business</p>
          <h2 className="font-display font-bold text-[30px] text-[#253022] leading-[38px] w-full">The Nest</h2>
          <p className="font-display font-bold text-[9px] text-[#423926] tracking-[1.8px] uppercase w-full">
            Vintage &amp; Decor · Woman-owned
          </p>
        </div>
        <div className="px-5 pt-[10px]">
          <div className="relative h-[300px] w-full rounded-[2px] overflow-hidden">
            <img src={IMG.featuredPhoto} alt="The Nest" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col gap-5 items-center text-center pt-7 pb-[56px] px-[30px]">
          <p className="font-body italic text-[14px] text-[#253022] leading-6">
            &ldquo;Shop Small. Shop Local. Be Awesome.&rdquo;
          </p>
          <p className="font-body text-[12px] text-[#423926] leading-[22px]">
            The Nest is a Reno boutique overflowing with vintage treasures — mid-century furniture, vintage clothing, decor and the kind of finds you didn&apos;t know you were looking for.
          </p>
          <p className="font-body text-[12px] text-[#423926] leading-[22px]">
            Woman-owned and operated, it&apos;s built on a simple philosophy: shop small, shop local, be awesome.
          </p>
          <Link href="/businesses/the-nest" className="bg-[#2c4a34] text-[#faf6e9] font-display font-bold text-[10px] tracking-[1.8px] uppercase px-7 py-4 rounded-[2px] hover:bg-[#253022] transition-colors">
            View full profile
          </Link>
        </div>
      </section>

      {/* Desktop */}
      <section className="hidden md:block relative bg-[#faf6e9] h-[648px] overflow-hidden">
        <div className="absolute left-20 right-20 top-24">
          <p className="font-display font-bold text-[13px] text-[#b7a78c] uppercase tracking-wider">FEATURED BUSINESS</p>
          <p className="font-display font-bold text-[40px] text-[#151814] mt-[6px]">THE NEST</p>
          <p className="font-display font-bold text-[13px] text-[#596155] uppercase mt-1">VINTAGE &amp; DECOR</p>

          {/* Left: photo + owner card */}
          <div className="absolute top-[116px] left-0 w-[560px]">
            <div className="relative h-[340px] w-full rounded-[12px] overflow-hidden bg-[#b7a78c]">
              <img src={IMG.featuredPhoto} alt="The Nest" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-[-12px] left-4 bg-white rounded-[10px] shadow-[0px_4px_16px_rgba(37,48,34,0.10)] w-[320px] h-[148px] flex items-start p-4 gap-4 overflow-hidden">
              <div className="w-[60px] h-[60px] rounded-full flex-shrink-0 overflow-hidden bg-[#d9d4cc]">
                <img src="/thenest.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-[3px] overflow-hidden">
                <p className="font-display font-bold text-[11px] text-[#b7a78c] uppercase">WOMAN-OWNED &amp; OPERATED</p>
                <p className="font-display font-bold text-[16px] text-[#151814]">The Nest</p>
                <p className="font-display text-[12px] text-[#596155]">Locally run, Reno since day one</p>
                <p className="font-display text-[12px] text-[#596155] mt-2">&ldquo;Shop Small. Shop Local. Be Awesome.&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div className="absolute top-[116px] left-[620px] w-[560px] flex flex-col gap-7">
            <p className="font-display text-[17px] text-[#151814] leading-relaxed">
              The Nest is a Reno boutique overflowing with vintage treasures — mid-century furniture, vintage clothing, decor, and one-of-a-kind finds. Every piece is hand-selected for character, not just condition.
            </p>
            <p className="font-display text-[17px] text-[#151814] leading-relaxed">
              Woman-owned and operated, The Nest is built on a simple philosophy: shop small, shop local, be awesome. It&apos;s proof that supporting an independent business can be just as fun as it is meaningful.
            </p>
            <Link href="/businesses/the-nest" className="inline-flex items-center gap-3 bg-[#2c4a34] text-white font-display font-bold text-[16px] uppercase px-6 h-12 rounded-[8px] w-fit hover:bg-[#253022] transition-colors">
              VIEW FULL PROFILE <ChevronRight color="white" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          BECOME A MEMBER
      ════════════════════════════════ */}
      <section className="flex flex-col items-center text-center gap-[18px] md:gap-8 px-8 md:px-[240px] py-16 md:py-[100px] bg-[#2c4a34] md:bg-[#423926]">
        <p className="md:hidden font-display font-bold text-[9px] text-[#b5c98a] tracking-[3px] uppercase">Membership</p>
        <h2 className="font-display font-bold text-[24px] md:text-[64px] text-[#faf6e9] uppercase tracking-[0.5px] md:tracking-normal leading-[30px] md:leading-none">
          Become a Member
        </h2>
        {/* Mobile */}
        <p className="md:hidden font-body text-[12px] text-[#e8ebe6] leading-[22px]">
          Members get real perks: exclusive discounts at local shops, early access to new openings, and a community map built by neighbors, for neighbors.
        </p>
        {/* Desktop */}
        <p className="hidden md:block font-body text-[20px] text-[#e8ebe6] leading-[1.6]">
          Members get real perks: exclusive discounts at local shops, early access to markets and pop-ups, and a community map built by neighbors, for neighbors. Every membership also fuels independent local journalism in Northern Nevada — you save money and support the city at the same time.
        </p>
        <Link href="/signup" className="bg-[#faf6e9] md:bg-[#faf8f5] text-[#253022] font-display font-bold text-[10px] md:text-[20px] tracking-[1.8px] md:tracking-normal uppercase px-7 md:px-10 py-4 rounded-[2px] md:rounded-[100px] inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
          Join as a Member
          <span className="hidden md:block"><ChevronRight color="#253022" /></span>
        </Link>
      </section>

      {/* ════════════════════════════════
          BE FOUND
      ════════════════════════════════ */}
      <section className="flex flex-col items-center text-center gap-[18px] md:gap-8 px-7 md:px-[240px] pt-[60px] md:py-[100px] pb-[56px] bg-[#faf6e9] border-b border-[#dbe0d9]">
        <h2 className="font-display font-bold text-[22px] md:text-[64px] text-[#253022] uppercase tracking-[0.5px] md:tracking-normal leading-[30px] md:leading-none">
          Get Found by Local Customers
        </h2>
        {/* Mobile */}
        <p className="md:hidden font-body text-[12px] text-[#596155] leading-[22px]">
          Own an independent business in the Reno–Tahoe area? List your business and get connected with shoppers who are actively looking to buy local — a community that already loves where they shop.
        </p>
        {/* Desktop */}
        <p className="hidden md:block font-body text-[20px] text-[#596155] leading-[1.6]">
          Own an independent business in the Reno–Tahoe area? List your business and get connected with shoppers who are actively looking to buy local — a community that already cares where their money goes. Share your hours, upload photos, and let neighbors discover the heart of your trade.
        </p>
        <Link href="/signup" className="border border-[#253022] md:bg-[#253022] md:border-transparent md:text-white text-[#253022] font-display font-bold text-[10px] md:text-[20px] tracking-[1.8px] md:tracking-normal uppercase px-7 md:px-10 py-[15px] md:py-4 rounded-[2px] md:rounded-[100px] inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          List your business
          <span className="hidden md:block"><ChevronRight color="white" /></span>
        </Link>
      </section>

      {/* ════════════════════════════════
          FOLLOW THE COMMUNITY
      ════════════════════════════════ */}

      {/* Mobile */}
      <section className="md:hidden bg-[#faf6e9] flex flex-col gap-5 pb-[56px]">
        <div className="flex flex-col gap-2 items-center text-center px-7 pt-[56px]">
          <h2 className="font-display font-bold text-[17px] text-[#253022] tracking-[0.5px] uppercase w-full">Follow the community</h2>
          <p className="font-body text-[11px] text-[#596155] w-full">@checklocalfirst</p>
        </div>
        <div className="flex flex-col gap-[2px]">
          <div className="flex gap-[2px] h-[128px]">
            <a href="https://www.instagram.com/checklocalfirstreno/" target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <img src={IMG.ig1} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </a>
            <a href="https://www.instagram.com/checklocalfirstreno/" target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <img src={IMG.ig2} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </a>
            <a href="https://www.instagram.com/checklocalfirstreno/" target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <img src={IMG.ig3} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </a>
          </div>
          <div className="flex gap-[2px] h-[128px]">
            <a href="https://www.instagram.com/checklocalfirstreno/" target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <img src={IMG.ig4} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </a>
            <a href="https://www.instagram.com/checklocalfirstreno/" target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <img src={IMG.ig1} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </a>
            <a href="https://www.instagram.com/checklocalfirstreno/" target="_blank" rel="noopener noreferrer" className="flex-1 relative overflow-hidden">
              <img src={IMG.ig2} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </a>
          </div>
        </div>
      </section>

      {/* Desktop */}
      <section className="hidden md:flex flex-col bg-[#faf6e9]">
        <div className="px-20 pt-16">
          <h2 className="font-display font-bold text-[64px] text-[#151814] uppercase">Follow THE COMMUNITY</h2>
        </div>
        <FollowCarousel />
        <p className="font-body text-[20px] text-[#6b7d67] text-center py-6">@checklocalfirst</p>
      </section>

      <Footer />
    </>
  );
}
