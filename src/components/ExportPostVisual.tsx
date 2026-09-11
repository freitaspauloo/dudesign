"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { SocialPost } from "@/content/social-posts";
import { PostVisual } from "./PostVisual";

const exportSizeFor = (slug: string) =>
  slug === "wait-three-months"
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1080 };

async function waitForAssets(root: HTMLElement) {
  await document.fonts.ready;
  await Promise.all(
    Array.from(root.querySelectorAll("img")).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );
}

export function ExportPostVisual({ post }: { post: SocialPost }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const { width, height } = exportSizeFor(post.slug);
  const isPoster = post.slug === "wait-three-months";

  async function exportPng() {
    const node = isPoster ? exportRef.current : previewRef.current;
    if (!node || state === "busy") return;

    setState("busy");

    try {
      await waitForAssets(node);

      const dataUrl = isPoster
        ? await toPng(node, {
            width,
            height,
            pixelRatio: 1,
            cacheBust: true,
            skipAutoScale: true,
            backgroundColor: "#ffffff",
          })
        : await (async () => {
            const rect = node.getBoundingClientRect();
            return toPng(node, {
              pixelRatio: width / rect.width,
              cacheBust: true,
              skipAutoScale: true,
            });
          })();

      const link = document.createElement("a");
      link.download = `${post.number}-${post.slug}.png`;
      link.href = dataUrl;
      link.click();
      setState("done");
      window.setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("idle");
    }
  }

  const label =
    state === "busy" ? "Exporting…" : state === "done" ? "Exported" : "Export PNG";

  return (
    <div className="post-visual-export">
      <div className="pv-frame pv-frame--preview" ref={previewRef}>
        <PostVisual post={post} />
      </div>

      {isPoster ? (
        <div
          className="pv-frame pv-frame--export"
          ref={exportRef}
          aria-hidden
          style={{ width, height }}
        >
          <PostVisual post={post} />
        </div>
      ) : null}

      <button type="button" className="post-export" onClick={exportPng}>
        {label}
      </button>
    </div>
  );
}
