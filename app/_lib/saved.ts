import { sql } from "./sql";
import type { SavedWord } from "../quiz/types";
import type { RawRow } from "./script";
import type { Vocabulary } from "./jpdb/types";

export async function getSavedWords() {
  return sql<SavedWord[]>`
    select * from saved
    inner join dictionary on word_id = dictionary.id
    where user_id = 'nanda.s@hey.com'
    order by saved.created_at desc
  `;
}

interface SavedWordWithExamplesResponse {
  word: string;
  word_id: string;
  sentence_id: string;
  literal: string;
  metadata: Vocabulary;
  offset: string;
  row_blob: RawRow;
}

interface SavedWordWithExamples {
  id: string;
  text: string;
  metadata: Vocabulary;
  examples: {
    id: string;
    offset: number;
    literal: string;
    en: {
      text: string;
      character: string;
    };
    jp: {
      text: string;
      character: string;
    };
    parts: {
      type: "text" | "word";
      text: string;
    }[];
  }[];
}

const cache = new Map<string, SavedWordWithExamples>();

export async function getSavedWord(
  id: string,
): Promise<SavedWordWithExamples | null> {
  const cached = cache.get(id);
  if (cached) return cached;

  const response = await sql<SavedWordWithExamplesResponse[]>`
    select
      word,
      dictionary.id as word_id,
      sentences.id as sentence_id,
      literal,
      metadata,
      examples.offset,
      row_blob
    from dictionary
    inner join examples on dictionary.id = examples.word_id
    inner join sentences on examples.sentence_id = sentences.id
    where dictionary.id = ${id}
  `;
  if (!response.length) return null;

  const word = response[0];
  const result = {
    id: word.word_id,
    text: word.word,
    metadata: word.metadata,
    examples: response.map((r) => {
      const parts = r.row_blob.jpnSearchText.split(r.literal);
      return {
        id: r.sentence_id,
        offset: Number(r.offset),
        literal: r.literal,
        en: {
          text: r.row_blob.engSearchText,
          character: r.row_blob.engChrName,
        },
        jp: {
          text: r.row_blob.jpnSearchText.replaceAll("<br/>", ""),
          character: r.row_blob.jpnChrName,
        },
        parts: [
          parts[0]
            ? {
                type: "text",
                text: parts[0].replaceAll("<br/>", ""),
              }
            : undefined,
          {
            type: "word",
            text: r.literal,
          },
          parts[1]
            ? {
                type: "text",
                text: parts[1].replaceAll("<br/>", ""),
              }
            : undefined,
        ].filter(Boolean) as { type: "text" | "word"; text: string }[],
      };
    }),
  };
  cache.set(id, result);
  return result;
}
