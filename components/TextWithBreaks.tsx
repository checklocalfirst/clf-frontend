import { Fragment } from "react";

/**
 * Renders line breaks typed by business owners in a plain textarea as real
 * <br> elements — without dangerouslySetInnerHTML. Handles both actual
 * newlines (pressing Enter/leaving a blank line) and literal "<br>" text
 * (kept for businesses that saved descriptions before newlines were
 * supported).
 */
export default function TextWithBreaks({ text }: { text: string }) {
  const parts = text.split(/<br\s*\/?>|\r\n|\r|\n/gi);
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
