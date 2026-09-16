/** Prefix public asset paths when basePath is set (e.g. /paulo in local dev). */
export function assetPath(path: string): string {
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
