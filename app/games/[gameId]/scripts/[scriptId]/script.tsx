"use client";

import React from "react";
import { addToFavourite, getTranslation } from "./actions";
import { useParams } from "next/navigation";

type TranslationState = {
  row: number;
  words: Array<{
    word: string;
    meaning: string;
    reading: string;
    type: string;
    form: string;
    dictionary: string;
  }>;
};

export function Script({ script }: { script: any[] }) {
  const params = useParams() as { gameId: string; scriptId: string };
  const [loading, setLoading] = React.useState<number | null>(null);
  const [translation, setTranslation] = React.useState<TranslationState | null>(
    null
  );
  return (
    <div className="flex gap-8">
      <ul className="text-lg max-w-[900px] shrink-0 border rounded-xl divide-y">
        {script.map((row) => {
          return (
            <li className="grid grid-cols-2 divide-x" key={row.row}>
              <div className="p-4 space-y-2">
                <h2 className="font-medium">{row.engChrName}</h2>
                <p>{row.engSearchText}</p>
              </div>
              <button
                className={`p-4 space-y-2 block text-start hover:bg-gray-100 w-full relative ${
                  row.row === translation?.row ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setLoading(row.row);
                  getTranslation(row.jpnSearchText, {
                    gameId: params.gameId,
                    scriptId: params.scriptId,
                    row: row.row,
                  }).then(({ words }) => {
                    console.log(words);
                    setTranslation({ row: row.row, words });
                    setLoading(null);
                  });
                }}
              >
                <h2 className="font-medium">{row.jpnChrName}</h2>
                <p dangerouslySetInnerHTML={{ __html: row.jpnHtmlText }} />
                {loading === row.row && (
                  <span className="absolute top-2 right-4 block animate-spin">
                    <Spin />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {translation && (
        <ul className="border h-fit w-full rounded-xl divide-y sticky top-8">
          {translation.words.map((word) => {
            return (
              <li
                className="grid grid-cols-[1fr_1fr_min-content] divide-x items-center"
                key={word.word}
              >
                <div className="p-4 flex items-center justify-between">
                  <p className="text-2xl">{word.word}</p>
                  <p className="text-gray-500">{word.reading}</p>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p>{word.meaning}</p>
                  <div className="flex gap-2">
                    <p className="text-sm text-gray-700 bg-gray-100 w-fit px-2 py-1 rounded-md">
                      {word.type}
                    </p>
                    {word.form && (
                      <p className="text-sm text-gray-700 bg-gray-100 w-fit px-2 py-1 rounded-md">
                        {word.form}
                      </p>
                    )}
                  </div>
                </div>
                <div className="aspect-square h-full flex items-center px-4">
                  <FavouriteButton word={word} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FavouriteButton({ word }: { word: any }) {
  const [favourited, setFavourited] = React.useState(false);
  return (
    <button
      className="rounded-full bg-gray-100 p-1 border"
      onClick={async () => {
        await addToFavourite(word.word, word);
        setFavourited(true);
      }}
    >
      {favourited ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5.75 12.8665L8.33995 16.4138C9.15171 17.5256 10.8179 17.504 11.6006 16.3715L18.25 6.75"
          ></path>
        </svg>
      ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 5.75V18.25"
          ></path>
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M18.25 12L5.75 12"
          ></path>
        </svg>
      )}
    </button>
  );
}

const Spin = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4.75V6.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M17.1266 6.87347L16.0659 7.93413"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M19.25 12L17.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M17.1266 17.1265L16.0659 16.0659"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M12 17.75V19.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M7.9342 16.0659L6.87354 17.1265"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M6.25 12L4.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M7.9342 7.93413L6.87354 6.87347"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};
