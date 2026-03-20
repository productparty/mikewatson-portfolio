/**
 * Frontend utilities for normalizing and validating Stitch recommendations.
 */

const MIN_LENGTH = 10;
const MAX_LENGTH = 120;

/** Normalize a recommendation string: trim, fix punctuation, ensure question mark. */
function normalize(text: string): string {
  let cleaned = text
    .replace(/^\s*[-*•]\s*/, "")
    .replace(/^\s*\d+[.)]\s*/, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  // Reject anything that looks like raw JSON/object data
  if (
    cleaned.includes("{") ||
    cleaned.includes("}") ||
    cleaned.includes(':"') ||
    cleaned.startsWith("[") ||
    /^\s*$/.test(cleaned)
  ) {
    return "";
  }

  // Enforce length bounds
  if (cleaned.length < MIN_LENGTH || cleaned.length > MAX_LENGTH) {
    return "";
  }

  // Ensure ends with punctuation
  if (!/[.?!]$/.test(cleaned)) {
    cleaned += "?";
  }

  return cleaned;
}

/** Deduplicate by lowercased content similarity. */
function deduplicate(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Validate, normalize, deduplicate, and rank recommendations. */
export function sanitizeRecommendations(
  raw: unknown,
  max: number = 4
): string[] {
  if (!Array.isArray(raw)) return [];

  const normalized = raw
    .filter((item): item is string => typeof item === "string")
    .map(normalize)
    .filter(Boolean);

  return deduplicate(normalized).slice(0, max);
}
