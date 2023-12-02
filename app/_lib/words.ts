import { supabase } from "./supabase";

export interface WordEntry {
  id: number;
  meanings: string[];
  readings: string[];
  part_of_speech?: string;
  wanikani_id?: string;
  text: string;
}

interface SentenceId {
  gameId: string;
  scriptId: string;
  row: number;
}

export interface Example {
  game_id: string;
  script_id: string;
  row: number;
  offset: number;
  word_id: number;
  text: string;
  form: string;
}

export async function getSentenceWords({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: number;
}): Promise<Example[]> {
  const { data } = await supabase
    .from("examples")
    .select()
    .eq("game_id", gameId)
    .eq("script_id", scriptId)
    .eq("row", row)
    .order("offset");
  return data as Example[];
}

export async function addWordsToSentence(
  words: {
    entry: Omit<WordEntry, "id">;
    text: string;
    offset: number;
    form: string;
  }[],
  sentence: SentenceId
) {
  const { error: upsertError } = await supabase
    .from("words")
    .upsert(words.map(({ entry }) => entry));
  if (upsertError) throw upsertError;
  const examples = words.map(({ entry, text, offset, form }) => {
    return {
      game_id: sentence.gameId,
      script_id: sentence.scriptId,
      row: sentence.row,
      offset,
      word: entry.text,
      text,
      form,
    };
  });
  const { error } = await supabase.from("examples").upsert(examples);
  if (error) throw error;
}
