"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Next's <Link> only scrolls to top when it decides the new page "isn't visible"
// at the current scroll offset — on a long page (e.g. clicking a footer link while
// scrolled to the bottom) it frequently guesses wrong and leaves the scroll position
// where it was. Force it on every route change instead. Keyed on pathname only (not
// search params) so in-page filter/query updates don't get yanked back to the top.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
