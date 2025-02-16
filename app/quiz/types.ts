import type { Vocabulary } from "../_lib/jpdb/types";

export type SavedWord = {
  user_id: string;
  word_id: string;
  proficiency: string;
  id: string;
  word: string;
  metadata: Vocabulary;
};
