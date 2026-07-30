import Link from "next/link";

const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "About", href: "/about" },
];

const FOR_BUSINESSES = [
  { label: "Add Your Business", href: "/signup" },
  { label: "Business Login", href: "/login" },
  { label: "Dashboard", href: "/dashboard" },
];

const OTHER = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

/* ── Desktop footer column ── */
function NavColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4 w-[160px]">
      <p className="font-display font-bold text-[20px] text-white uppercase opacity-50">
        {heading}
      </p>
      <div className="flex flex-col gap-[10px]">
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="font-display font-bold text-[20px] text-white uppercase whitespace-nowrap hover:opacity-70 transition-opacity"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Mobile footer section ── */
function MobileNavSection({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="border-t border-[#3d5142] flex flex-col gap-3 py-[22px]">
      <p className="font-display font-bold text-[10px] text-[#b5c98a] tracking-[2px] uppercase">
        {heading}
      </p>
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="font-body text-[12px] text-[#faf6e9] hover:opacity-70 transition-opacity"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer>
      {/* ── Desktop (md+) ── */}
      <div className="hidden md:flex flex-col gap-16 bg-[#9ca889] pt-20 pb-10 px-20">
        <div className="flex items-start justify-between">
          {/* Brand */}
          <div className="w-[360px]">
            <Link
              href="/"
              className="font-display font-bold text-[20px] text-white uppercase whitespace-nowrap"
            >
              Check Local First
            </Link>
          </div>

          {/* Nav columns */}
          <div className="flex gap-20 items-start">
            <NavColumn heading="Explore" links={EXPLORE} />
            <NavColumn heading="For Businesses" links={FOR_BUSINESSES} />
            <NavColumn heading="Other" links={OTHER} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#41523d] flex items-center justify-between pt-6">
          <p className="font-mono text-[20px] text-white opacity-40 whitespace-nowrap">
            © 2026 Check Local First. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Mobile (< md) ── */}
      <div className="md:hidden bg-[#253022] flex flex-col pt-[52px] pb-9 px-7">
        {/* Newsletter */}
        <div className="flex flex-col gap-[14px] pb-9">
          <p className="font-display font-bold text-[16px] text-[#faf6e9] tracking-[0.5px] uppercase">
            Check Local First
          </p>
          <p className="font-body text-[11px] text-[#b7a78c] leading-5">
            Be the first to know about new local finds, member perks, and what&apos;s opening around town.
          </p>
          <div className="border-b border-[#6b7d67] flex items-center justify-between pb-3">
            <input
              type="email"
              placeholder="Email address"
              className="font-body text-[11px] text-[#faf6e9] placeholder:text-[#8c9c81] bg-transparent outline-none flex-1"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="font-display font-bold text-[13px] text-[#faf6e9] ml-2"
            >
              →
            </button>
          </div>
        </div>

        {/* Nav sections */}
        <MobileNavSection heading="Explore" links={EXPLORE} />
        <MobileNavSection heading="For Businesses" links={FOR_BUSINESSES} />
        <MobileNavSection heading="Other" links={OTHER} />

        {/* Legal */}
        <div className="flex flex-col gap-[10px] pt-7">
          <p className="font-display font-bold text-[9px] text-[#8c9c81] tracking-[1.6px] uppercase">
            Instagram · TikTok · Newsletter
          </p>
          <p className="font-body text-[10px] text-[#6b7d67]">
            © 2026 Check Local First. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
