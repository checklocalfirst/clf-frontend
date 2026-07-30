"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Businesses", href: "/businesses" },
  { label: "Membership", href: "/membership" },
  { label: "About", href: "/about" },
  { label: "Search", href: "/search" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="relative z-50">
        {/* ── Desktop (md+) ── */}
        <div className="hidden md:flex items-center justify-between h-24 pl-16 pr-10 bg-[#faf6e9] border-b border-[#dbe0d9]">
          <Link href="/" className="flex-shrink-0 w-[62px] h-[70px]">
            <img src="/clf.png" alt="Check Local First" className="w-full h-full object-contain" />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-5">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`font-display font-bold text-[20px] uppercase whitespace-nowrap transition-colors ${
                    pathname === href ? "text-[#253022]" : "text-[#596155] hover:text-[#253022]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <Link
              href="/login"
              className="bg-[#2c4a34] text-white font-display font-bold text-[20px] uppercase px-6 py-[10px] rounded-[6px] whitespace-nowrap hover:bg-[#253022] transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* ── Mobile bar (< md) ── */}
        <div className="md:hidden flex items-center justify-between h-[66px] px-5 bg-[#faf6e9] border-b border-[#d9d4cc]">
          {/* Hamburger / close */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex flex-col gap-[5px] items-center justify-center w-6 h-6 flex-shrink-0 cursor-pointer"
          >
            {menuOpen ? (
              /* X */
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="#151814" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              /* Hamburger */
              <>
                <span className="bg-[#151814] block h-[1.5px] w-5" />
                <span className="bg-[#151814] block h-[1.5px] w-5" />
                <span className="bg-[#151814] block h-[1.5px] w-3" />
              </>
            )}
          </button>

          {/* Logo — centered */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38px] h-[43px]"
          >
            <img src="/clf.png" alt="Check Local First" className="w-full h-full object-contain" />
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/search" aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#151814" strokeWidth="1.4" />
                <path d="M11 11L15.5 15.5" stroke="#151814" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </Link>
            <Link href="/account" aria-label="My account">
              <div className="w-[15px] h-[15px] border-[1.4px] border-[#151814] rounded-[2px]" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-[#253022] flex flex-col">
          {/* Top bar — mirrors mobile header height */}
          <div className="flex items-center justify-between h-[66px] px-5 border-b border-[rgba(250,246,233,0.12)] flex-shrink-0">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex items-center justify-center w-6 h-6 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="#faf6e9" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <Link href="/" onClick={() => setMenuOpen(false)} className="w-[38px] h-[43px]">
              <img src="/clf.png" alt="Check Local First" className="w-full h-full object-contain" />
            </Link>

            {/* Spacer to balance the X button */}
            <div className="w-6" />
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-8 pt-10 gap-1 flex-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`font-display font-bold text-[38px] uppercase leading-tight py-3 border-b border-[rgba(250,246,233,0.10)] transition-opacity ${
                  pathname === href ? "text-[#faf6e9]" : "text-[rgba(250,246,233,0.55)] hover:text-[#faf6e9]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Bottom CTAs */}
          <div className="px-8 pb-12 flex flex-col gap-3 flex-shrink-0">
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="w-full bg-[#9ca889] text-[#253022] font-display font-bold text-[15px] uppercase text-center py-4 rounded-[8px] hover:opacity-90 transition-opacity"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full border border-[rgba(250,246,233,0.3)] text-[#faf6e9] font-display font-bold text-[15px] uppercase text-center py-4 rounded-[8px] hover:border-[rgba(250,246,233,0.6)] transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
