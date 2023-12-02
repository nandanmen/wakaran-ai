import { getRow } from "./script";
import { supabase } from "./supabase";

export const getKey = ({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: number;
}) => `${gameId}:${scriptId}:${row}`;

export async function get(key: string) {
  const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  });
  const { result } = await response.json();
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}

function getCachedTranslation({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: number;
}) {
  const key = getKey({ gameId, scriptId, row });
  return get(key);
}

export interface RawWord {
  word: string;
  meaning: string;
  reading: string;
  type: string;
  form: string;
  dictionary: string;
}

export interface Sentence {
  game_id: string;
  script_id: string;
  row: number;
  en_text: string;
  en_speaker: string;
  jp_text: string;
  jp_speaker: string;
  translation: RawWord[];
}

export async function updateSentenceTranslation(
  words: RawWord[],
  {
    gameId,
    scriptId,
    row,
  }: {
    gameId: string;
    scriptId: string;
    row: number;
  }
): Promise<void> {
  await supabase
    .from("sentences")
    .update({
      translation: words,
    })
    .eq("game_id", gameId)
    .eq("script_id", scriptId)
    .eq("row", row);
}

export async function getSentence({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: number;
}): Promise<Sentence> {
  const { data: maybeSentence } = await supabase
    .from("sentences")
    .select()
    .eq("game_id", gameId)
    .eq("script_id", scriptId)
    .eq("row", row)
    .single();
  if (maybeSentence) return maybeSentence as Sentence;

  // Sentence doesn't exist
  const { words: translation } = await getCachedTranslation({
    gameId,
    scriptId,
    row,
  });
  const scriptRow = await getRow({ gameId, scriptId, row });
  const { data, error } = await supabase
    .from("sentences")
    .upsert({
      game_id: gameId,
      script_id: scriptId,
      row,
      en_text: scriptRow.engSearchText,
      en_speaker: scriptRow.engChrName,
      jp_text: scriptRow.jpnSearchText.replaceAll("<br/>", ""),
      jp_speaker: scriptRow.jpnChrName,
      translation,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Sentence;
}
