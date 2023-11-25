"use client";

import React from "react";
import type { Word } from "../games/[gameId]/scripts/[scriptId]/script";

export function WordItem({ word }: { word: Word }) {
  const [open, setOpen] = React.useState(false);
  return (
    <li>
      <button
        className="lg:grid grid-cols-2 divide-y divide-dashed lg:divide-y-0 lg:divide-solid lg:divide-x divide-gray-7 items-center w-full"
        onClick={() => setOpen(!open)}
      >
        <div className="p-4 flex items-center justify-between">
          <p className="text-2xl">{word.dictionary || word.word}</p>
          <p className="text-gray-11">{word.reading}</p>
        </div>
        <div className="p-4 flex items-center justify-between">
          <p>{word.meaning}</p>
          <div className="flex gap-2">
            <p className="text-sm text-gray-11 bg-gray-3 w-fit px-2 py-1 rounded-md">
              {word.type}
            </p>
          </div>
        </div>
      </button>
      {open && (
        <div className="flex justify-end p-4 bg-gray-2 border-t border-gray-7">
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href={`https://jisho.org/search/${word.dictionary || word.word}`}
          >{`Jisho ->`}</a>
        </div>
      )}
    </li>
  );
}
