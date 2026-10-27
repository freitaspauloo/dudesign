"use client";

import { useState } from "react";

export function CopyCaption({ label, text }: { label: string; text: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1600);
      }}
    >
      {done ? "Copied" : `Copy ${label}`}
    </button>
  );
}
