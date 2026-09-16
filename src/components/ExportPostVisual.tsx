"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  POST_EXPORT_HEIGHT,
  POST_EXPORT_WIDTH,
  type SocialPost,
} from "@/content/social-posts";
import { PostVisual } from "@/components/PostVisual";

async function waitForAssets(root: HTMLElement) {
  await document.fonts.ready;
  await Promise.all(
    Array.from(root.querySelectorAll("img")).map(async (img) => {
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }
      if (img.decode) {
        try {
          await img.decode();
        } catch {
          /* ignore decode errors */
        }
      }
    }),
  );
}

async function waitForPaint() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function ExportPostVisual({ post }: { post: SocialPost }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const exportStageRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  async function exportPng() {
    if (state === "busy") return;

    const preview = previewRef.current;
    const exportStage = exportStageRef.current;
    const exportFrame = exportStage?.querySelector<HTMLElement>(".pv-frame--export");

    const captureNode =
      post.kind === "portfolio" ? preview : exportFrame;
    if (!captureNode) return;

    setState("busy");

    if (post.kind !== "portfolio" && exportStage) {
      exportStage.classList.add("is-capturing");
    }

    try {
      await waitForAssets(captureNode);
      await waitForPaint();

      const dataUrl =
        post.kind === "portfolio"
          ? await toPng(captureNode, {
              pixelRatio:
                POST_EXPORT_WIDTH / captureNode.getBoundingClientRect().width,
              skipAutoScale: true,
              cacheBust: true,
              backgroundColor: "#ffffff",
            })
          : await toPng(captureNode, {
              width: POST_EXPORT_WIDTH,
              height: POST_EXPORT_HEIGHT,
              pixelRatio: 1,
              skipAutoScale: true,
              cacheBust: true,
              backgroundColor: "#ffffff",
            });

      const link = document.createElement("a");
      link.download = `${post.number}-${post.slug}.png`;
      link.href = dataUrl;
      link.click();
      setState("done");
      window.setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("idle");
    } finally {
      exportStage?.classList.remove("is-capturing");
    }
  }

  const label =
    state === "busy" ? "Exporting…" : state === "done" ? "Exported" : "Export PNG";

  return (
    <div className="post-visual-export">
      <div
        ref={previewRef}
        className={`pv-frame pv-frame--preview pv-frame--${post.kind}`}
      >
        <PostVisual post={post} />
      </div>

      {post.kind === "process" ? (
        <div className="pv-export-stage" ref={exportStageRef} aria-hidden>
          <div className="pv-frame pv-frame--export">
            <PostVisual post={post} />
          </div>
        </div>
      ) : null}

      <button type="button" className="post-export" onClick={exportPng}>
        {label}
      </button>
    </div>
  );
}
