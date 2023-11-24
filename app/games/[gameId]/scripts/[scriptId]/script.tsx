"use client";

import React from "react";
import { getTranslation } from "./actions";

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
  const [loading, setLoading] = React.useState<number | null>(null);
  const [translation, setTranslation] = React.useState<TranslationState | null>(
    null
  );
  return (
    <div className="flex">
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
                  row.row === translation?.row ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  setLoading(row.row);
                  getTranslation(row.jpnSearchText).then(({ words }) => {
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
      <pre>{JSON.stringify(translation, null, 2)}</pre>
    </div>
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
