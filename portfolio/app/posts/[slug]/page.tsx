import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyCaption } from "@/src/components/CopyCaption";
import { ExportPostVisual } from "@/src/components/ExportPostVisual";
import { getSocialPost, socialPosts } from "@/src/content/social-posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return socialPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getSocialPost(slug);
  if (!post) return { title: "Post" };
  return { title: post.title };
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

            <h2>LinkedIn / Instagram</h2>
            <pre>{post.linkedin}</pre>
            <div className="post-actions">
              <CopyCaption label="LinkedIn / Instagram" text={post.linkedin} />
            </div>

            <h2>X</h2>
            <pre>{post.x}</pre>
            <div className="post-actions">
              <CopyCaption label="X" text={post.x} />
            </div>

            <p className="post-note">
              Export PNG at 1080 x 1350. Paste the caption. Portfolio posts use
              the device frame. Process posts are week 1 / 4 / 7.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
