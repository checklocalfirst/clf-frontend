import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Check Local First.",
  alternates: { canonical: "/terms" },
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
const PAGE_TITLE = "Terms of Service";
const LAST_UPDATED = "Last updated: August 8, 2026";
const CONTACT_EMAIL = "checklocalfirst@gmail.com";

const INTRO_BODY = (
  <>
    These terms govern your use of Check Local First (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
    &ldquo;our&rdquo;). By creating an account or using the site, you agree to them.
  </>
);

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. What Check Local First Is",
    body: (
      <p>
        Check Local First is a directory that connects shoppers with independently owned businesses
        in the Reno, NV area. We offer free and Premium accounts for shoppers, and Basic and Premium
        listing tiers for businesses.
      </p>
    ),
  },
  {
    heading: "2. Accounts",
    body: (
      <>
        <p>
          You&apos;re responsible for the accuracy of the information on your account and for keeping
          your login credentials secure. One account per person or business — don&apos;t create
          accounts on behalf of someone else without their permission.
        </p>
        <p>
          Business signup is completed through our Stripe checkout flow. Because no password is
          collected at that step, we email the account owner a link to set up login credentials after
          payment succeeds.
        </p>
      </>
    ),
  },
  {
    heading: "3. Business Listings & Content",
    body: (
      <>
        <p>
          Businesses are responsible for the accuracy of their profile — description, hours, contact
          info, and anything else displayed publicly. We review and approve new listings, manage
          category assignments, and control which photos appear on a listing.
        </p>
        <p>
          We may remove or edit listing content that&apos;s inaccurate, misleading, or violates these
          terms.
        </p>
      </>
    ),
  },
  {
    heading: "4. Premium Memberships & Payments",
    body: (
      <p>
        Premium subscriptions, for both shoppers and businesses, are billed through Stripe.
        Cancelling a subscription takes effect at the end of the current billing period — you keep
        Premium access until then, and your account reverts to the free/Basic tier afterward.
        Pricing may change; we&apos;ll do our best to give notice before it does.
      </p>
    ),
  },
  {
    heading: "5. Discount Codes",
    body: (
      <p>
        Discount codes are a Premium shopper benefit and can only be redeemed once per person, per
        discount. Businesses set and are responsible for honoring the discounts they list. Check
        Local First is not a party to the transaction between a shopper and a business — we provide
        the listing and the redemption record, not the underlying sale.
      </p>
    ),
  },
  {
    heading: "6. Acceptable Use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Scrape, copy, or republish listing data without permission.</li>
          <li>Redeem a discount code fraudulently or on behalf of someone else.</li>
          <li>Impersonate a business or another person.</li>
          <li>Interfere with the normal operation of the site.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "7. Termination",
    body: (
      <p>
        We may suspend or terminate an account that violates these terms. You can request that your
        account be deleted at any time — for a business, this permanently removes the listing, its
        services, photos, and discounts along with the owner login.
      </p>
    ),
  },
  {
    heading: "8. Disclaimers",
    body: (
      <p>
        Check Local First is provided &ldquo;as is.&rdquo; We don&apos;t guarantee that every listing
        is accurate, current, or that a business will honor a discount exactly as displayed — we
        rely on businesses to keep their own information up to date.
      </p>
    ),
  },
  {
    heading: "9. Limitation of Liability",
    body: (
      <p>
        To the fullest extent permitted by law, Check Local First isn&apos;t liable for indirect,
        incidental, or consequential damages arising from your use of the site, including
        transactions with businesses listed on it.
      </p>
    ),
  },
  {
    heading: "10. Changes to These Terms",
    body: (
      <p>
        We may update these terms as the product changes. If we make material changes, we&apos;ll
        update the &ldquo;Last updated&rdquo; date above.
      </p>
    ),
  },
  {
    heading: "11. Governing Law",
    body: <p>These terms are governed by the laws of the State of Nevada.</p>,
  },
  {
    heading: "12. Contact Us",
    body: (
      <p>
        Questions about these terms? Email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2c4a34] underline hover:text-[#253022] transition-colors">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
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
