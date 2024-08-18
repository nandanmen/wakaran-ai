import { getTranslation, type Word } from "./translation";
import { shouldFetchLocal } from "./config";
import * as local from "./local";
import { cache } from "react";
import { parse } from "node-html-parser";

const BASE_URL = `https://trailsinthedatabase.com`;
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
  const [response, translation] = await Promise.all([
    getScript({ gameId, scriptId }),
    getTranslation({ gameId, scriptId, rowNumber }),
  ]);
  const row = response?.at(rowNumber - 1);
  if (!row || !translation) return;

  let audio = null;
  if (row.engHtmlText?.match(/<audio/g)) {
    const tree = parse(row.engHtmlText);
    const sources = tree.querySelectorAll("audio source");
    audio = sources.map((el) => `${BASE_URL}/${el.attributes.src}`);
  }

  return {
    translation: translation.words,
    audio,
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
