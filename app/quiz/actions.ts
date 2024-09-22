"use server";

import { isKanji } from "wanakana";
import { type Entry, search } from "../_lib/dictionary";

export async function getKanjisForWord(word: string): Promise<Entry[]> {
  const kanjiChars = new Set<string>([...word].filter(isKanji));

  const kanjis: Promise<Entry[]>[] = [];
  kanjiChars.forEach((char) => {
    kanjis.push(search(char));
  });

  const results = await Promise.all(kanjis);
  return results.flat();
}
