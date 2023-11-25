"use server";

import { OpenAI } from "openai";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getKey = ({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: number;
}) => `${gameId}:${scriptId}:${row}`;

function get(key: string) {
  return fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then(({ result }) => JSON.parse(result));
}

export async function isFavourite(details: any) {
  const response = await get(
    `nanda:favourites:${details.dictionary || details.word}`
  );
  return response;
}

export async function addToFavourite(details: any) {
  const response = await kv.set(
    `nanda:favourites:${details.dictionary || details.word}`,
    details
  );
  revalidatePath("/favourites");
  return response;
}

export async function getTranslation(
  sentence: string,
  {
    gameId,
    scriptId,
    row,
  }: {
    gameId: string;
    scriptId: string;
    row: number;
  }
) {
  const key = getKey({ gameId, scriptId, row });
  const response = get(key);
  if (response) return response;

  const parsed = sentence.replaceAll("<br/>", "");
  const { usage, choices } = await translate(parsed);
  console.log(
    `Input: ${usage?.prompt_tokens} tokens, Output: ${usage?.completion_tokens} tokens`
  );
  const [call] = choices.flatMap((choice) => choice.message.tool_calls);
  const results = JSON.parse(call?.function.arguments ?? "{}");

  await kv.set(key, results);

  return results;
}

function translate(sentence: string) {
  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Translate this sentence from Japanese and break it down into its grammatical components. For all kanji, include furigana. Format the result in a table with word -> meaning pairs. Sentence: ${sentence} Translation:`,
      },
    ],
    temperature: 0,
    tools: [
      {
        type: "function",
        function: {
          name: "format_translation",
          description: "Formats the translation into a table.",
          parameters: {
            type: "object",
            properties: {
              words: {
                type: "array",
                description:
                  "The grammatical components found in the given sentence.",
                items: {
                  type: "object",
                  properties: {
                    word: {
                      type: "string",
                      description: "The exact word found in the sentence",
                    },
                    meaning: {
                      type: "string",
                      description: "The meaning of the word in english",
                    },
                    reading: {
                      type: "string",
                      description:
                        "If the word includes kanji, the reading of the word in hiragana.",
                    },
                    type: {
                      type: "string",
                      description:
                        "The grammatical type of the word. For example, 見る is a verb while に is a particle",
                      enum: [
                        "particle",
                        "i-adjective",
                        "na-adjective",
                        "verb",
                        "noun",
                      ],
                    },
                    form: {
                      type: "string",
                      description:
                        "The form of the word. For example, 見て is in the te-form.",
                    },
                    dictionary: {
                      type: "string",
                      description:
                        "The dictionary form of the word. For example, the dictionary form of 見て is 見る.",
                    },
                  },
                },
              },
            },
            required: ["words"],
          },
        },
      },
    ],
  });
}
