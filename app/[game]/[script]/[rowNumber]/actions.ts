"use server";

import { search } from "@/app/_lib/dictionary";
import { saveWord as saveWordLocal } from "@/app/_lib/local";
import { sql } from "@/app/_lib/sql";
import type { Word } from "@/app/_lib/translation";

export async function saveWord(word: Word, key: string) {
  return saveWordLocal(word.dictionary || word.word, key);
}

export async function saveToDatabase(data: FormData) {
  const text = data.get("word")?.toString();
  if (!text) return;
  try {
    const [entry] = await search(text);
    if (!entry) return;
    await sql`
      INSERT INTO words (text, meanings, readings)
      VALUES (${entry.text}, ${entry.meanings}, ${entry.readings})
    `;
  } catch (e) {
    console.error(e);
    return;
  }
}

export async function getWord(text: string) {
  return search(text);
}
