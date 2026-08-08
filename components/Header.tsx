"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth, accountHomeFor, type AccountType } from "@/lib/auth";

// Rendered before the Membership dropdown, which always comes last.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Search", href: "/search" },
  { label: "Businesses", href: "/businesses" },
];

const MEMBERSHIP_LINKS = [
  { label: "Locals", href: "/membership/locals" },
  { label: "Businesses", href: "/membership/businesses" },
];

const ACCOUNT_LABEL: Record<AccountType, string> = {
  admin: "Admin Dashboard",
  business: "Business Dashboard",
  user: "My Account",
};

function AccountIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="2.75" stroke="white" strokeWidth="1.4" />
      <path
        d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [membershipMenuOpen, setMembershipMenuOpen] = useState(false);
  const [mobileMembershipOpen, setMobileMembershipOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const membershipMenuRef = useRef<HTMLDivElement>(null);

  const membershipActive = pathname.startsWith("/membership");

  // Close on route change — adjusted during render rather than in an effect,
  // so the reset lands in the same commit as the navigation instead of one tick later.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setAccountMenuOpen(false);
    setMembershipMenuOpen(false);
  }

  // Close the account dropdown on an outside click
  useEffect(() => {
    if (!accountMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountMenuOpen]);

  // Close the membership dropdown on an outside click
  useEffect(() => {
    if (!membershipMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (membershipMenuRef.current && !membershipMenuRef.current.contains(e.target as Node)) {
        setMembershipMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [membershipMenuOpen]);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Collapse the mobile membership accordion whenever the full-screen menu closes
  const [prevMenuOpen, setPrevMenuOpen] = useState(menuOpen);
  if (menuOpen !== prevMenuOpen) {
    setPrevMenuOpen(menuOpen);
    if (!menuOpen) setMobileMembershipOpen(false);
  }

  return (
    <>
      <header className="relative z-50">
        {/* ── Desktop (md+) ── */}
        <div className="hidden md:flex items-center justify-between h-24 pl-16 pr-10 bg-[#faf6e9] border-b border-[#dbe0d9]">
          <Link href="/" className="flex-shrink-0 w-[62px] h-[70px]">
            <Image src="/clfblacklogo.png" alt="Check Local First" width={62} height={70} priority className="w-full h-full object-contain" />
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

              <div className="relative flex-shrink-0" ref={membershipMenuRef}>
                <button
                  type="button"
                  onClick={() => setMembershipMenuOpen((o) => !o)}
                  aria-expanded={membershipMenuOpen}
                  className={`font-display font-bold text-[20px] uppercase whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                    membershipActive ? "text-[#253022]" : "text-[#596155] hover:text-[#253022]"
                  }`}
                >
                  Membership
                  <ChevronIcon open={membershipMenuOpen} />
                </button>

                {membershipMenuOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] w-[200px] bg-white border border-[#dbe0d9] rounded-[12px] shadow-lg py-2 flex flex-col z-50">
                    {MEMBERSHIP_LINKS.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMembershipMenuOpen(false)}
                        className="font-display font-bold text-[13px] text-[#253022] uppercase px-4 py-3 hover:bg-[#faf6e9] transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </nav>

            {!loading && (
              user ? (
                <div className="relative flex-shrink-0" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((o) => !o)}
                    aria-label="My account"
                    aria-expanded={accountMenuOpen}
                    className="bg-[#2c4a34] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#253022] transition-colors cursor-pointer"
                  >
                    <AccountIcon />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white border border-[#dbe0d9] rounded-[12px] shadow-lg py-2 flex flex-col z-50">
                      <Link
                        href={accountHomeFor(user.accountType)}
                        onClick={() => setAccountMenuOpen(false)}
                        className="font-display font-bold text-[13px] text-[#253022] uppercase px-4 py-3 hover:bg-[#faf6e9] transition-colors"
                      >
                        {ACCOUNT_LABEL[user.accountType]}
                      </Link>
                      <div className="h-px bg-[#dbe0d9] mx-4" />
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout();
                        }}
                        className="font-display font-bold text-[13px] text-[#596155] uppercase px-4 py-3 text-left hover:bg-[#faf6e9] transition-colors cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#2c4a34] text-white font-display font-bold text-[20px] uppercase px-6 py-[10px] rounded-[6px] whitespace-nowrap hover:bg-[#253022] transition-colors"
                >
                  Log In
                </Link>
              )
            )}
          </div>
        </div>

        {/* ── Mobile bar (< md) ── */}
        <div className="md:hidden flex items-center justify-between h-[66px] px-5 bg-[#faf6e9] border-b border-[#d9d4cc]">
          {/* Logo + menu toggle — logo stays top-left, hamburger sits to its right */}
          <div className="flex items-center gap-4">
            <Link href="/" className="w-[38px] h-[43px] flex-shrink-0">
              <Image src="/clfblacklogo.png" alt="Check Local First" width={38} height={43} priority className="w-full h-full object-contain" />
            </Link>

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
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/search" aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#151814" strokeWidth="1.4" />
                <path d="M11 11L15.5 15.5" stroke="#151814" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </Link>
            <Link href={user ? accountHomeFor(user.accountType) : "/login"} aria-label="My account">
              {user ? (
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5.5" r="2.75" stroke="#151814" strokeWidth="1.4" />
                  <path
                    d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
                    stroke="#151814"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <div className="w-[15px] h-[15px] border-[1.4px] border-[#151814] rounded-[2px]" />
              )}
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
              <Image src="/clfblacklogo.png" alt="Check Local First" width={38} height={43} className="w-full h-full object-contain" />
            </Link>

            {/* Spacer to balance the X button */}
            <div className="w-6" />
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-8 pt-10 gap-1 flex-1 overflow-y-auto">
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

            <div className="flex flex-col border-b border-[rgba(250,246,233,0.10)]">
              <button
                type="button"
                onClick={() => setMobileMembershipOpen((o) => !o)}
                aria-expanded={mobileMembershipOpen}
                className={`flex items-center justify-between gap-3 font-display font-bold text-[38px] uppercase leading-tight py-3 transition-opacity cursor-pointer ${
                  membershipActive ? "text-[#faf6e9]" : "text-[rgba(250,246,233,0.55)] hover:text-[#faf6e9]"
                }`}
              >
                Membership
                <ChevronIcon open={mobileMembershipOpen} />
              </button>

              {mobileMembershipOpen && (
                <div className="flex flex-col gap-1 pb-4 pl-2">
                  {MEMBERSHIP_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="font-display font-bold text-[22px] uppercase text-[rgba(250,246,233,0.7)] hover:text-[#faf6e9] transition-opacity py-2"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </nav>

          {/* Bottom CTAs */}
          <div className="px-8 pb-12 flex flex-col gap-3 flex-shrink-0">
            {user ? (
              <>
                <Link
                  href={accountHomeFor(user.accountType)}
                  onClick={() => setMenuOpen(false)}
                  className="w-full bg-[#9ca889] text-[#253022] font-display font-bold text-[15px] uppercase text-center py-4 rounded-[8px] hover:opacity-90 transition-opacity"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full border border-[rgba(250,246,233,0.3)] text-[#faf6e9] font-display font-bold text-[15px] uppercase text-center py-4 rounded-[8px] hover:border-[rgba(250,246,233,0.6)] transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
