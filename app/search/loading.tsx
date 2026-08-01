import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

export default function SearchLoading() {
  return (
    <>
      <Header />

      <div className="bg-[#faf6e9]">
        <div className="max-w-[1280px] mx-auto w-full px-5 md:px-10 py-10 animate-pulse">
          <div className="h-6 w-40 bg-[#dbe0d9] rounded mb-8 md:hidden" />
          <div className="hidden md:block h-6 w-56 bg-[#dbe0d9] rounded mb-8" />

          <div className="mb-8 max-w-[520px]">
            <SearchBar />
          </div>

          <div className="flex flex-wrap gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full md:w-[calc(33.333%-16px)] rounded-[16px] border border-[#dbe0d9] overflow-hidden bg-[#faf6e9]"
              >
                <div className="h-[180px] md:h-[220px] w-full bg-[#c9d2cf]" />
                <div className="flex flex-col gap-3 p-6">
                  <div className="h-4 w-24 bg-[#dbe0d9] rounded-full" />
                  <div className="h-5 w-3/4 bg-[#dbe0d9] rounded" />
                  <div className="h-3 w-1/2 bg-[#dbe0d9] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
