import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";

export default function BusinessDetailLoading() {
  return (
    <main className="bg-[#faf6e9]">
      <Header />

      <div className="bg-[#faf6e9] border-b border-[#dbe0d9]">
        <div className="hidden md:flex items-center justify-center h-[112px] px-[280px]">
          <SearchBar className="w-[880px]" />
        </div>
        <div className="md:hidden flex items-center h-[72px] px-[16px]">
          <SearchBar className="w-full" />
        </div>
      </div>

      <div className="animate-pulse px-[16px] md:px-[64px] py-[32px] md:py-[48px] flex flex-col gap-4">
        <div className="h-4 w-32 bg-[#dbe0d9] rounded" />
        <div className="h-10 md:h-16 w-2/3 bg-[#dbe0d9] rounded" />
        <div className="h-4 w-1/2 bg-[#dbe0d9] rounded" />
        <div className="h-[240px] md:h-[420px] w-full bg-[#c9d2cf] rounded-[12px] mt-4" />
      </div>
    </main>
  );
}
