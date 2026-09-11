import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyCaption } from "@/components/CopyCaption";
import { ExportPostVisual } from "@/components/ExportPostVisual";
import { getSocialPost, socialPosts } from "@/content/social-posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return socialPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getSocialPost(slug);
  if (!post) return { title: "Post — Paulo Freitas" };
  return { title: `${post.title} — Paulo Freitas` };
}

export default async function SocialPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getSocialPost(slug);
  if (!post) notFound();

  const date = new Date(`${post.date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <header className="posts-bar">
        <Link href="/posts" className="posts-brand">
          <span className="posts-brand-name">Paulo Freitas</span>
          <span className="posts-brand-role">Product Designer + Engineer</span>
        </Link>
        <p className="posts-bar-meta">posts</p>
      </header>
    <div className="posts-wrap">
      <Link href="/posts" className="post-back">
        all posts
      </Link>
      <div className="post-page">
        <ExportPostVisual post={post} />
        <div className="post-copy">
          <p className="post-sub">
            {post.number} · {post.format} · {date} · {post.channels.join(" · ")}
          </p>
          <h1>{post.title}</h1>
          <p className="post-visual-note">{post.visual}</p>

          <h2>LinkedIn</h2>
          <pre>{post.linkedin}</pre>
          <div className="post-actions">
            <CopyCaption label="LinkedIn" text={post.linkedin} />
          </div>

          <h2>X</h2>
          <pre>{post.x}</pre>
          <div className="post-actions">
            <CopyCaption label="X" text={post.x} />
          </div>

          <h2>Instagram</h2>
          <pre>{post.linkedin}</pre>
          <div className="post-actions">
            <CopyCaption label="Instagram" text={post.linkedin} />
          </div>

          <p className="post-note">
            Export PNG for Daniel. Paste the caption. No company name on the YC
            work until you say so.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
