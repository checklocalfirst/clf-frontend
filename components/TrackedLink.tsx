"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackBusinessEvent } from "@/lib/directory";
import type { AnalyticsEventType } from "@/lib/business-dashboard";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  slug: string;
  event: AnalyticsEventType;
}

/** Plain `<a>` that fires a fire-and-forget analytics event on click without blocking navigation. */
export default function TrackedLink({ slug, event, onClick, ...rest }: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackBusinessEvent(slug, event);
        onClick?.(e);
      }}
    />
  );
}
