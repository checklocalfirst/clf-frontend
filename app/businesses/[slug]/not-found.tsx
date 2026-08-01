import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BusinessNotFound() {
  return (
    <>
      <Header />

      <main className="bg-[#faf6e9] min-h-[calc(100vh-96px)] flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
        <h1 className="font-display font-bold text-[32px] text-[#423926]">
          Business Not Found
        </h1>
        <p className="font-body text-[14px] text-[#596155] max-w-[420px]">
          We couldn&apos;t find a business at this address — it may have been removed or the link is incorrect.
        </p>
        <Link
          href="/search"
          className="bg-[#2c4a34] rounded-[8px] px-8 py-[14px] font-display font-bold text-[16px] text-white uppercase hover:bg-[#253022] transition-colors"
        >
          Browse Businesses
        </Link>
      </main>

      <Footer />
    </>
  );
}
