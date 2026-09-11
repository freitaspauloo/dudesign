import Link from "next/link";
import { PostVisual } from "@/components/PostVisual";
import { socialPosts } from "@/content/social-posts";

export default function PostsHubPage() {
  return (
    <>
      <header className="posts-bar">
        <Link href="/" className="posts-brand">
          <span className="posts-brand-name">Paulo Freitas</span>
          <span className="posts-brand-role">Product Designer + Engineer</span>
        </Link>
        <p className="posts-bar-meta">posts</p>
      </header>
      <div className="posts-wrap">
        <h1 className="posts-h1">I&apos;m Paulo, a product designer who engineers.</h1>
        <p className="posts-lead">
          I design complex product surfaces and ship them in code. Visuals
          here. Copy ready to paste. The YC work stays unnamed until you want
          the name public.
        </p>
        <div className="posts-grid">
          {socialPosts
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="posts-card"
              >
                <div className="pv-frame">
                  <PostVisual post={post} />
                </div>
                <div className="posts-card-meta">
                  <span>{post.number}</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                <p className="posts-card-title">{post.title}</p>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
