import Header from "@/components/Header";

export default function HomeLoading() {
  return (
    <>
      <Header />
      <div className="h-[560px] md:h-[620px] w-full bg-[#e8ebe6] animate-pulse" />
      <div className="bg-[#faf6e9] px-5 md:px-20 py-16 flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-48 bg-[#dbe0d9] rounded mx-auto" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[280px] md:w-[360px] h-[300px] flex-shrink-0 bg-[#dbe0d9] rounded-[16px]" />
          ))}
        </div>
      </div>
    </>
  );
}
