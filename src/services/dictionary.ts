import { MOCK_WORDS, type DictionaryEntry } from "@/data/mockWords";

export type {
  DictionaryEntry,
  DictionaryExample,
  DictionaryMeaning,
} from "@/data/mockWords";

export type SimilarWord = {
  key: string;
  score: number;
  mainTranslation: string;
};

export type WordMeta = {
  tier: number;
  catalogNo: string;
};

// The current search screen intentionally shows its loading state for a moment.
// Keeping the delay here preserves today's behaviour while the real API is built.
const LOOKUP_DELAY_MS = 800;

function normalizeTerm(term: string): string {
  return (term || "").trim().toLowerCase();
}

function computeEditDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

/**
 * Looks up one entry for the search screen.
 *
 * The async signature is deliberate: this can later call /api/lookup without
 * changing any component. Until then it searches the local MOCK_WORDS data.
 */
export async function lookupWord(
  term: string
): Promise<DictionaryEntry | null> {
  await new Promise((resolve) => setTimeout(resolve, LOOKUP_DELAY_MS));

  const normalized = normalizeTerm(term);
  if (!normalized) return null;

  const direct = MOCK_WORDS[normalized];
  if (direct) return direct;

  const reverseMatch = Object.values(MOCK_WORDS).find((entry) =>
    entry.meanings.some((meaning) =>
      meaning.translation.toLowerCase().includes(normalized)
    )
  );

  return reverseMatch || null;
}

/** Synchronous exact lookup for render paths that already know the headword. */
export function getWord(word: string): DictionaryEntry | null {
  const normalized = normalizeTerm(word);
  if (!normalized) return null;
  return MOCK_WORDS[normalized] || null;
}

/** All headwords, used by the specimen index and the daily word. */
export function listWords(): string[] {
  return Object.keys(MOCK_WORDS);
}

/** Synchronous card metadata; no async work during render. */
export function getWordMeta(word: string): WordMeta | null {
  const entry = getWord(word);
  if (!entry) return null;
  return { tier: entry.tier, catalogNo: entry.catalogNo };
}

/** Translation pool for quiz distractors. */
export function getAllTranslations(): string[] {
  const translations = new Set<string>();

  Object.values(MOCK_WORDS).forEach((entry) => {
    entry.meanings.forEach((meaning) => {
      if (meaning.translation) translations.add(meaning.translation);
    });
  });

  return Array.from(translations);
}

/** Tolerant "nearby entry" recommendations for the search screen. */
export function getSimilarWords(rawQuery: string): SimilarWord[] {
  const query = normalizeTerm(rawQuery);
  const allKeys = listWords();

  const scored = allKeys.map((key) => {
    const entry = MOCK_WORDS[key];
    let score = 0;

    if (!query) {
      return {
        key,
        score,
        mainTranslation: entry.meanings[0]?.translation || "",
      };
    }

    if (key.includes(query) || query.includes(key)) score += 60;
    if (key.startsWith(query.slice(0, 2))) score += 25;

    const tokens = key.split(/\s+/);
    if (tokens.some((token) => token.startsWith(query) || query.startsWith(token))) {
      score += 40;
    }

    entry.meanings.forEach((meaning) => {
      if (meaning.translation.toLowerCase().includes(query)) score += 55;
      if (meaning.definition.toLowerCase().includes(query)) score += 20;
      if (meaning.context && meaning.context.toLowerCase().includes(query)) {
        score += 15;
      }
    });

    const distance = computeEditDistance(query, key);
    score += Math.max(0, 35 - distance * 10);

    return {
      key,
      score,
      mainTranslation: entry.meanings[0]?.translation || "",
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
}
