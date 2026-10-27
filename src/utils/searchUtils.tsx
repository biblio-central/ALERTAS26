import React from 'react';

/**
 * Normalizes text for search:
 * - lowercase
 * - strips accents / tildes (á, é, í, ó, ú, ü, etc.)
 * - trims extra spaces
 */
export function normalizeText(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Checks if all words in query are present in the target fields (accent- and case-insensitive)
 */
export function matchSearch(fields: (string | undefined | null)[], query: string): boolean {
  const normQuery = normalizeText(query);
  if (!normQuery) return true;

  // Split query into words/tokens
  const tokens = normQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  // Combine and normalize all search target fields
  const combined = normalizeText(fields.filter(Boolean).join(' '));

  // All tokens must be found
  return tokens.every((token) => combined.includes(token));
}

/**
 * Renders text with search query matches highlighted in bright yellow (<mark>)
 * Handles accents / tildes transparently so "electronica" highlights "Electrónica"
 */
export function HighlightText({
  text,
  query,
  className = '',
}: {
  text: string | undefined | null;
  query: string;
  className?: string;
}): React.JSX.Element {
  if (!text) return <span className={className}></span>;
  if (!query || !query.trim()) return <span className={className}>{text}</span>;

  const rawTokens = query.trim().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return <span className={className}>{text}</span>;

  // Create regex pattern matching any token, accounting for accents
  // Map normalized characters back to accent-aware regex character groups
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const charToPattern = (char: string) => {
    const c = char.toLowerCase();
    switch (c) {
      case 'a':
        return '[aáàäâãAÁÀÄÂÃ]';
      case 'e':
        return '[eéèëêEÉÈËÊ]';
      case 'i':
        return '[iíìïîIÍÌÏÎ]';
      case 'o':
        return '[oóòöôõOÓÒÖÔÕ]';
      case 'u':
        return '[uúùüûUÚÙÜÛ]';
      case 'n':
        return '[nñNÑ]';
      default:
        return escapeRegex(char);
    }
  };

  const patternParts = rawTokens.map((tok) => {
    // strip accents from token first to build broad character class
    const cleanTok = normalizeText(tok);
    return cleanTok.split('').map(charToPattern).join('');
  });

  try {
    const regex = new RegExp(`(${patternParts.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span className={className}>
        {parts.map((part, index) => {
          if (!part) return null;
          const isMatch = rawTokens.some((tok) => normalizeText(part) === normalizeText(tok));
          if (isMatch) {
            return (
              <mark
                key={index}
                className="bg-yellow-300 text-slate-950 px-0.5 rounded-xs font-semibold shadow-2xs"
                title="Término coincidente"
              >
                {part}
              </mark>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  } catch (e) {
    return <span className={className}>{text}</span>;
  }
}
