/**
 * Sanitize post-login redirect targets.
 * Accepts relative paths only (incl. query), e.g. /abonnement?pack=essai.
 */
export function safeNextPath(
  raw: unknown,
  fallback = "/espace"
): string {
  if (typeof raw !== "string" || !raw) return fallback;
  let path = raw.trim();
  // Guard against leftover encoding from double-encoded Link hrefs
  try {
    if (path.includes("%2F") || path.includes("%3F") || path.includes("%2f")) {
      path = decodeURIComponent(path);
    }
  } catch {
    return fallback;
  }
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  if (path.includes("://") || path.includes("\\")) return fallback;
  return path;
}

/** Build /connexion?next=… with correct single encoding of nested queries. */
export function connexionWithNext(next: string): string {
  return `/connexion?next=${encodeURIComponent(safeNextPath(next, "/espace"))}`;
}
