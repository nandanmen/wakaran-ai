"use client";

import React from "react";
import { Entry } from "@/app/_lib/dictionary";
import { RawWord } from "@/app/_lib/sentences";

export function TranslationItem({
  word,
  entries,
}: {
  word: RawWord;
  entries: Entry[];
}) {
  const [selectedEntry, setSelectedEntry] = React.useState(
    entries.length > 1 ? null : 0
  );
  return (
    <>
      {selectedEntry !== null && (
        <input
          type="hidden"
          name="entry"
          value={JSON.stringify({
            entry: entries[selectedEntry],
            word,
          })}
        />
      )}
      <ul className="divide-y divide-dashed divide-gray-7">
        {entries.map((entry, index) => {
          return (
            <li
              key={entry.id}
              className={`p-4 bg-gray-2 flex justify-between text-sm ${
                selectedEntry !== null && index !== selectedEntry
                  ? "text-gray-10"
                  : ""
              }`}
              onClick={() => setSelectedEntry(index)}
            >
              <span className="flex gap-2">
                <span>{entry.text}</span>
                <span>{entry.readings?.join(",")}</span>
                <span>{entry.meanings.join(",")}</span>
              </span>
              <span className="flex gap-2">
                <a
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://jisho.org/word/${entry.text}`}
                >{`Jisho ->`}</a>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
