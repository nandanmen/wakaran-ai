import jisho from "./jisho";
import { get, set } from "./kv";
import { profile } from "./utils";

const WANIKANI_TOKEN = process.env.WANIKANI_API_KEY;

export interface Entry {
  id: string;
  text: string;
  meanings: string[];
  readings: string[];
  wanikani?: boolean;
}

const searchWanikani = async (texts: string[]): Promise<Entry[]> => {
  try {
    const wanikani = await fetch(
      `https://api.wanikani.com/v2/subjects?slugs=${texts.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${WANIKANI_TOKEN}`,
        },
      },
    );
    let { data: response } = await wanikani.json();
    if (response.length > 1) {
      response = response.filter((d: any) => d.object === "vocabulary");
    }
    return response.map((d: any) => {
      return {
        id: d.id,
        text: d.data.slug,
        meanings: d.data.meanings
          ?.filter((v: any) => v.accepted_answer)
          .map((m: any) => m.meaning.toLowerCase()),
        readings: d.data.readings
          ?.filter((v: any) => v.accepted_answer)
          .map((r: any) => r.reading),
        wanikani: true,
      };
    });
  } catch {
    console.log(`Could not find wanikani results for ${texts.join(", ")}`);
    return [];
  }
};

export interface KanjiEntry {
  text: string;
  meanings: string[];
  kunyomi: string[];
  onyomi: string[];
  frequencyRank: number;
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
}

export const searchForKanji = async (
  text: string,
): Promise<KanjiEntry | null> => {
  const key = `kanji:${text}`;
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
  return parsed;
};

export const search = async (
  text: string,
  // { kanji = false }: { kanji?: boolean } = {}
): Promise<Entry[]> => {
  console.log("[search] Searching for", text);

  let results = await searchWanikani([text]);
  if (results.length > 0) {
    console.log("[search] Found wanikani results");
    return results;
  }

  console.log("[search] Searching via jisho...");

  /* if (kanji) {
    const response = await jisho.searchForKanji(text);
    return response.
  } */

  const { data } = await jisho.searchForPhrase(text);
  const matches = data.filter(
    (entry) =>
      entry.slug === text ||
      entry.japanese.find((j) => j.word === text || j.reading === text),
  );

  const slugs = [
    ...new Set(
      matches.flatMap((m) => m.japanese.map((j) => j.word)).filter(Boolean),
    ),
  ];

  console.log(`[search] Found ${slugs.length} slugs: ${slugs.join(", ")}`);
  console.log("[search] Searching via wanikani...");
  results = await searchWanikani(slugs);
  if (results.length > 0) {
    console.log("[search] Found wanikani results");
    return results;
  }

  console.log("[search] No wanikani results found, falling back to jisho");
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
