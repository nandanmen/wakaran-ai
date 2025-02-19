"use client";

import type { Word as WordType } from "@/app/_lib/translation";
import { Word } from "./word";
import { useState } from "react";
import useSWR from "swr";
import { getIsSaved, saveNewWord } from "./actions";
import { CheckCircle } from "@/app/_components/icons";
import clsx from "clsx";

export function WordList({
  words,
}: {
  words: WordType[];
}) {
  const [activeWord, setActiveWord] = useState<WordType | null>(null);

  const uniqueWords = (() => {
    const seen = new Set<string>();
    const results: WordType[] = [];
    for (const word of words) {
      if (seen.has(word.word)) continue;
      results.push(word);
      seen.add(word.word);
    }
    return results;
  })();

  return (
    <>
      <ul className="grow overflow-y-auto row-span-2">
        {uniqueWords.map((word) => {
          const match = activeWord === word;
          return (
            <Word
              active={activeWord ? match : false}
              key={word.id}
              onClick={() => setActiveWord(word)}
              word={word}
            />
          );
        })}
      </ul>
      {activeWord && <WordCard word={activeWord} />}
    </>
  );
}

function WordCard({ word }: { word: WordType }) {
  const [loading, setLoading] = useState(false);
  const { data: isSaved, mutate } = useSWR(["is-saved", word.id], ([_, id]) =>
    getIsSaved(id),
  );
  return (
    <>
      <div className="mx-2 bg-gray-1 dark:bg-gray-3 rounded-lg border border-gray-6 divide-y divide-dashed divide-gray-6">
        <div className="font-jp flex justify-center items-end p-6">
          {word.data.reading.map((r) => {
            return (
              <span key={r.text} className="flex flex-col items-center">
                <span className="text-sm text-gray-11">{r.reading}</span>
                <span className="font-medium text-3xl">{r.text}</span>
              </span>
            );
          })}
        </div>
        <ul className="p-4 text-sm list-disc pl-8">
          {word.data.meanings.map((m) => {
            return (
              <li key={m}>
                <span>{m}</span>
              </li>
            );
          })}
        </ul>
        <div className="p-4 text-sm flex justify-between">
          <p className="py-1 px-3 text-blue-11 w-fit rounded-full font-medium bg-blue-5">
            Top {word.data.ranking}
          </p>
          <button
            type="button"
            className={clsx(
              "py-1 px-3 font-medium text-gray-1 rounded-full flex items-center",
              loading || isSaved
                ? "bg-gray-10 dark:bg-gray-9 pr-2"
                : "bg-gray-12",
            )}
            disabled={loading || isSaved}
            onClick={async () => {
              setLoading(true);
              await saveNewWord(word.id);
              mutate();
              setLoading(false);
            }}
          >
            <span>{loading ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
            {isSaved ? <CheckCircle size={20} /> : null}
          </button>
        </div>
      </div>
    </>
  );
}
