"use server";

import { saveWord as saveWordLocal } from "@/app/_lib/local";
import type { Word } from "@/app/_lib/translation";

export async function saveWord(word: Word, key: string) {
  return saveWordLocal(word.dictionary || word.word, key);
}
