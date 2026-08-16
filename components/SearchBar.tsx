"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export default function SearchBar({
  placeholder = "Search businesses, food & more...",
  className = "",
  defaultValue = "",
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function goToSearch() {
    const q = inputRef.current?.value.trim();
    inputRef.current?.blur(); // dismiss the mobile keyboard before navigating away
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToSearch();
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`relative flex items-center bg-white border border-[#dbe0d9] overflow-hidden select-none
        h-[46px] rounded-[23px] md:h-[64px] md:rounded-[32px] ${className}`}
    >
      {/* Search icon — also acts as a shortcut to the search page */}
      <button
        type="button"
        aria-label="Go to search page"
        onClick={goToSearch}
        className="absolute left-[14px] top-1/2 -translate-y-1/2 select-none cursor-pointer md:left-[17px]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[15px] h-[15px] md:w-4 md:h-4"
        >
          <circle cx="7" cy="7" r="5.5" stroke="#596155" strokeWidth="1.4" />
          <path
            d="M11 11L14.5 14.5"
            stroke="#596155"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Input */}
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full h-full bg-transparent outline-none select-text
          pl-[39px] pr-[50px] font-body text-base text-[#151814] placeholder:text-[#b7a78c]
          md:pl-[55px] md:pr-[68px] md:text-[17px] md:placeholder:text-[#596155]"
      />

      {/* Go button */}
      <button
        type="submit"
        aria-label="Search"
        className="absolute top-1/2 -translate-y-1/2
          right-[6px] bg-[#2c4a34] text-[#faf6e9] flex items-center justify-center
          rounded-[14px] w-[34px] h-[34px]
          md:rounded-[18px] md:w-[52px] md:h-[52px]
          hover:bg-[#253022] transition-colors cursor-pointer"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]"
        >
          <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.6" />
          <path d="M13 13L16.5 16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
