import { parse } from "node-html-parser";
import { cache } from "react";
import { shouldFetchLocal } from "./config";
import * as local from "./local";
import type { Word } from "./translation";
import { parseText } from "./jpdb/parse";
import { profile } from "./utils";
import type { Vocabulary } from "./jpdb/types";
import { sb } from "./supabase";

const BASE_URL = "https://trailsinthedatabase.com";
const API_BASE_URL = `${BASE_URL}/api/script/detail`;

export type RawRow = {
  gameId: number;
  fname: string;
  scene: string | null;
  row: number;
  engChrName: string;
  engHtmlText?: string;
  engSearchText: string;
  jpnChrName: string;
  jpnHtmlText: string;
  jpnSearchText: string;
  opName: string;
  pcIconHtml: string;
  evoIconHtml: string;
};

export const getScript = cache(async function getScript({
  gameId,
  scriptId,
}: {
  gameId: string;
  scriptId: string;
}): Promise<RawRow[] | null> {
  try {
    if (shouldFetchLocal) return local.getScript(scriptId);
    const response = await fetch(`${API_BASE_URL}/${gameId}/${scriptId}`, {
      cache: "force-cache",
    });
    const data = await response.json();
    return data as RawRow[];
  } catch {
    return null;
  }
});

const mapGameToId = {
  sky: "1",
} as const;

export const toGameId = (game: Game): string => {
  return mapGameToId[game];
};

export type Game = keyof typeof mapGameToId;

export type Row = {
  jp: {
    name: string;
    text: string;
  };
  en: {
    name: string;
    text: string;
  };
  audio: string[] | null;
  translation: Word[];
};

export const getAudioFromRow = (row: RawRow) => {
  if (!row.engHtmlText?.match(/<audio/g)) return null;
  const tree = parse(row.engHtmlText);
  const sources = tree.querySelectorAll("audio source");
  return sources.map((el) => `${BASE_URL}/${el.attributes.src}`);
};

const translationCache = new Map<string, { row: RawRow; words: Word[] }>();

async function getJpdbTranslation({
  gameId,
  scriptId,
  rowNumber,
}: {
  gameId: string;
  scriptId: string;
  rowNumber: number;
}): Promise<{ row: RawRow; words: Word[] } | undefined> {
  const id = `${gameId}:${scriptId}:${rowNumber}`;
  const cached = translationCache.get(id);
  if (cached) return cached;

  const maybeWords = await profile("sb get sentence", () =>
    sb
      .from("sentences")
      .select("row_blob, translation_blob")
      .eq("id", id)
      .single()
      .then((r) => r.data),
  );
  if (maybeWords) {
    return {
      row: maybeWords.row_blob as RawRow,
      words: maybeWords.translation_blob as Word[],
    };
  }

  const script = await getScript({ gameId, scriptId });
  const row = script?.[rowNumber - 1];
  if (!row) return;

  const jpTextClean = row.jpnSearchText.replaceAll("<br/>", "\n");
  const parsed = await profile("jpdb parse text", () => parseText(jpTextClean));

  const translation: Word[] = [];
  const wordsToAdd: Record<
    string,
    {
      data: Vocabulary;
      locations: {
        sentence_id: string;
        word_id: string;
        form_id: string;
        dictionary: string;
        literal: string;
        offset: number;
      }[];
    }
  > = {};

  for (const token of parsed.tokens) {
    if (token.type === "vocabulary") {
      const vocabulary = parsed.vocabulary[token.id];
      const [wid, fid] = token.id.split(":");
      const entry = wordsToAdd[wid];
      if (!entry) {
        wordsToAdd[wid] = {
          data: vocabulary,
          locations: [],
        };
      }
      wordsToAdd[wid].locations.push({
        sentence_id: id,
        word_id: wid,
        form_id: fid,
        dictionary: vocabulary.dictionary,
        literal: token.literal,
        offset: token.offset,
      });
      translation.push({
        id: wid,
        word: token.literal,
        meaning: vocabulary.meanings.at(0)?.split(";").at(0) ?? "",
        reading: token.reading.map((r) => r.reading ?? r.text).join(""),
        type: "word",
        form: "",
        dictionary: vocabulary.dictionary,
        data: vocabulary,
      });
    }
  }

  const examples = Object.values(wordsToAdd).flatMap((word) => word.locations);
  const wordsData = Object.entries(wordsToAdd).map(([wordId, { data }]) => {
    return {
      id: wordId,
      word: data.dictionary,
      metadata: data,
    };
  });

  await profile("sb update records", async () => {
    const resp1 = await Promise.all([
      sb
        .from("sentences")
        .upsert({ id, translation_blob: translation, row_blob: row }),
      sb.from("dictionary").upsert(wordsData),
    ]);
    const resp2 = await sb.from("examples").upsert(examples);
    return { resp1, resp2 };
  });

  translationCache.set(id, { row, words: translation });
  return { row, words: translation };
}

export const getRow = cache(async function getRow({
  game,
  scriptId,
  rowNumber,
}: {
  game: Game;
  scriptId: string;
  rowNumber: number;
}): Promise<Row | undefined> {
  const gameId = mapGameToId[game];
  const response = await getJpdbTranslation({ gameId, scriptId, rowNumber });
  if (!response) return;
  const { row, words } = response;
  return {
    translation: words,
    audio: getAudioFromRow(row),
    jp: {
      name: row.jpnChrName,
      text: row.jpnSearchText.replaceAll("<br/>", "\n"),
    },
    en: {
      name: row.engChrName,
      text: row.engSearchText,
    },
  };
});
