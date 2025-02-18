"use server";

import { search } from "@/app/_lib/dictionary";
import { saveWord as saveWordLocal } from "@/app/_lib/local";
import { sql } from "@/app/_lib/sql";
import type { Word } from "@/app/_lib/translation";
import { profile } from "@/app/_lib/utils";

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
  return profile("get word", () => search(text));
}

export async function saveNewWord(id: string) {
  const response = await sql`insert into saved (word_id) values (${id})`;
  return response;
}

export async function getIsSaved(id: string) {
  const response = await sql<
    {
      exists: boolean;
    }[]
  >`select exists (select 1 from saved where word_id = ${id})`;
  return response.at(0)?.exists;
}
