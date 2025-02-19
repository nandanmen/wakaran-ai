import jisho from "./jisho";
import { get, set } from "./kv";
import { profile } from "./utils";

export interface Entry {
  id: string;
  text: string;
  meanings: string[];
  readings: string[];
  wanikani?: boolean;
}

export interface KanjiEntry {
  text: string;
  meanings: string[];
  kunyomi: string[];
  onyomi: string[];
  frequencyRank: number;
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
}

const cache = new Map<string, KanjiEntry>();

export const searchForKanji = async (
  text: string,
): Promise<KanjiEntry | null> => {
  const key = `kanji:${text}`;
  const inMemoryCached = cache.get(key);
  if (inMemoryCached) return inMemoryCached;

  const cached = await profile("get cf kv", () => get<KanjiEntry>(key));
  if (cached) return cached;
  const result = await profile("get jisho", () => jisho.searchForKanji(text));
  if (!result.found) return null;
  const parsed = {
    text,
    meanings: result.meaning.split(", "),
    kunyomi: result.kunyomi,
    onyomi: result.onyomi,
    frequencyRank: Number(result.newspaperFrequencyRank),
    jlptLevel: result.jlptLevel as KanjiEntry["jlptLevel"],
  };
  await profile("set cf kv", () => set(key, parsed));
  cache.set(key, parsed);
  return parsed;
};

export const search = async (
  text: string,
  // { kanji = false }: { kanji?: boolean } = {}
): Promise<Entry[]> => {
  const { data } = await jisho.searchForPhrase(text);
  const matches = data.filter(
    (entry) =>
      entry.slug === text ||
      entry.japanese.find((j) => j.word === text || j.reading === text),
  );
  return matches.map((m) => {
    return {
      id: m.slug,
      text: m.slug,
      meanings: [
        ...new Set(m.senses.flatMap((s) => s.english_definitions)),
      ].slice(0, 5),
      readings: [...new Set(m.japanese.map((j) => j.reading))],
    };
  });
};
