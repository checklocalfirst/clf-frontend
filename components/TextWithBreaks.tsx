import { Fragment } from "react";

/**
 * Renders text with literal "<br>" (typed by business owners in a plain
 * textarea) as real line breaks — without dangerouslySetInnerHTML, since only
 * this one literal tag is recognized rather than arbitrary HTML.
 */
export default function TextWithBreaks({ text }: { text: string }) {
  const parts = text.split(/<br\s*\/?>/gi);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}
