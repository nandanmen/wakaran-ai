import { getTranslation, type Word } from "./translation";

const API_BASE_URL = `https://trailsinthedatabase.com/api/script/detail`;

export type RawRow = {
  gameId: number;
  fname: string;
  scene: string | null;
  row: number;
  engChrName: string;
  engSearchText: string;
  jpnChrName: string;
  jpnHtmlText: string;
  jpnSearchText: string;
  opName: string;
  pcIconHtml: string;
  evoIconHtml: string;
};

export async function getScript({
  gameId,
  scriptId,
}: {
  gameId: string;
  scriptId: string;
}) {
  const response = await fetch(`${API_BASE_URL}/${gameId}/${scriptId}`, {
    cache: "force-cache",
  });
  const data = await response.json();
  return data as RawRow[];
}

const mapGameToId = {
  sky: "1",
} as const;

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
  translation: Word[];
};

export async function getRow({
  game,
  scriptId,
  rowNumber,
}: {
  game: Game;
  scriptId: string;
  rowNumber: number;
}) {
  const gameId = mapGameToId[game];
  const response = await getScript({ gameId, scriptId });
  const row = response.at(rowNumber - 1);
  if (!row) return;

  const translation = await getTranslation({ gameId, scriptId, rowNumber });
  if (!translation) return;

  return {
    translation: translation.words,
    jp: {
      name: row.jpnChrName,
      text: row.jpnSearchText.replaceAll("<br/>", "\n"),
    },
    en: {
      name: row.engChrName,
      text: row.engSearchText,
    },
  };
}
