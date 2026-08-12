import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Check Local First collects, uses, and shares your information.",
  alternates: { canonical: "/privacy" },
};

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display font-bold text-[20px] md:text-[24px] text-[#253022]">{heading}</h2>
      <div className="flex flex-col gap-3 font-body text-[15px] text-[#423926] leading-[1.7]">
        {children}
      </div>
    </section>
  );
}

// ── Page copy — edit the text below without touching the layout/markup in the component ──
const PAGE_TITLE = "Privacy Policy";
const LAST_UPDATED = "Last updated: August 8, 2026";
const CONTACT_EMAIL = "checklocalfirst@gmail.com";

const INTRO_BODY = (
  <>
    This policy explains what information Check Local First (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
    &ldquo;our&rdquo;) collects when you use our directory of independently owned businesses in
    the Reno, NV area, how we use it, and who we share it with.
  </>
);

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "Information We Collect",
    body: (
      <>
        <p>
          <strong>Personal users.</strong> When you create a free or Premium account, we collect your
          first and last name, email address, phone number, and a password. Your password is handled
          entirely by our authentication provider, Supabase — we never see it in plain text.
        </p>
        <p>
          <strong>Businesses.</strong> When a business signs up or updates its profile, we collect the
          owner&apos;s first and last name, the business name, description, address, phone number,
          email, and anything else added to the profile — owner bio, social links, and timeline
          entries.
        </p>
        <p>
          <strong>Photos.</strong> Listing, owner, gallery, and timeline photos are uploaded by our
          team, sourced either from a professional photo shoot we arrange or from photos a business
          emails to us directly. If you email us photos, that submission is used to populate your
          public listing.
        </p>
        <p>
          <strong>Location data.</strong> When a business signs up, we send its address to Nominatim
          (OpenStreetMap) to resolve map coordinates, so the listing can appear in &ldquo;near
          me&rdquo; searches.
        </p>
        <p>
          <strong>Payment information.</strong> We never see or store your full card details. Payments
          and subscriptions are processed entirely by Stripe — we only retain a Stripe customer ID and
          subscription ID to manage your account.
        </p>
      </>
    ),
  },
  {
    heading: "Analytics & Discount Redemptions",
    body: (
      <>
        <p>
          We track anonymous, aggregate interactions with business listings — phone number clicks,
          email clicks, page views, address and map clicks, website link clicks, discount reveals, and
          Facebook, Instagram, or Yelp link clicks. These events are not tied to your identity, IP
          address, or session; we only know that an interaction of a given type happened, on a given
          business, at a given time.
        </p>
        <p>
          Discount redemptions are the one place our tracking isn&apos;t anonymous. When you redeem a
          discount code, we record which account redeemed which discount, and when, so the same code
          can&apos;t be redeemed twice by the same person. A business can mark a redemption as
          &ldquo;used&rdquo; once they&apos;ve seen it redeemed in person — that&apos;s bookkeeping on
          the same already-collected record, not an additional category of data.
        </p>
      </>
    ),
  },
  {
    heading: "How We Use Your Information",
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>To operate your account and the directory itself.</li>
        <li>To process payments and manage subscriptions, via Stripe.</li>
        <li>
          To send transactional email — password setup, receipts, welcome emails,
          premium-upgrade receipts, and cancellation confirmations — via Resend.
        </li>
        <li>To resolve a business&apos;s location for map and &ldquo;near me&rdquo; search.</li>
        <li>To understand aggregate, anonymous engagement with listings.</li>
        <li>To enforce the one-redemption-per-person, per-discount rule.</li>
      </ul>
    ),
  },
  {
    heading: "Cookies & Local Storage",
    body: (
      <p>
        We use your browser&apos;s local storage to keep you signed in between visits. This
        isn&apos;t a third-party tracking cookie — it stores your session on your own device so you
        don&apos;t have to log in on every page.
      </p>
    ),
  },
  {
    heading: "Photos, Storage & Public Visibility",
    body: (
      <p>
        Uploaded photos are stored in Supabase Storage and served from public URLs — anyone with the
        link can view them, by design, since they&apos;re meant to appear on public business
        listings.
      </p>
    ),
  },
  {
    heading: "Who We Share Information With",
    body: (
      <>
        <p>We don&apos;t sell your personal information. We share it with the services that run the site:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Supabase</strong> — database, authentication, and file storage.</li>
          <li><strong>Stripe</strong> — payment processing and subscription billing.</li>
          <li>
            <strong>Resend</strong> — transactional email (password setup, receipts, welcome emails,
            cancellation confirmations).
          </li>
          <li><strong>Nominatim / OpenStreetMap</strong> — address geocoding for map search.</li>
          <li><strong>Sentry</strong> — error monitoring, which may capture parts of a failing request.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Your Choices",
    body: (
      <p>
        You can update your account information at any time from your account or dashboard settings.
        You can request that your account and associated data be deleted by contacting us at the
        email below.
      </p>
    ),
  },
  {
    heading: "Changes to This Policy",
    body: (
      <p>
        We may update this policy as the product changes. If we make material changes, we&apos;ll
        update the &ldquo;Last updated&rdquo; date above.
      </p>
    ),
  },
  {
    heading: "Contact Us",
    body: (
      <p>
        Questions about this policy? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2c4a34] underline hover:text-[#253022] transition-colors">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="bg-[#faf6e9]">
        <div className="max-w-[760px] mx-auto px-5 md:px-10 py-12 md:py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h1 className="font-display font-bold text-[32px] md:text-[44px] text-[#151814] leading-tight">
              {PAGE_TITLE}
            </h1>
            <p className="font-body text-[13px] text-[#b7a78c]">{LAST_UPDATED}</p>
            <p className="font-body text-[15px] text-[#423926] leading-[1.7]">{INTRO_BODY}</p>
          </div>

          {SECTIONS.map((s) => (
            <Section key={s.heading} heading={s.heading}>
              {s.body}
            </Section>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
