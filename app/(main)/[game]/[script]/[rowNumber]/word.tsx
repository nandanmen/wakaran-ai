"use client";

import type { Word as WordType } from "@/app/_lib/translation";
import clsx from "clsx";
import { useParams } from "next/navigation";

export function Word({
  word,
  active,
  onClick,
}: { word: WordType; active: boolean; onClick: () => void }) {
  if (!word.meaning) return null;
  if (word.type === "particle") return null;
  return (
    <li>
      <button
        className={clsx(
          "flex justify-between items-center h-10 px-2.5 rounded-md w-full border",
          active
            ? "bg-gray-1 border-gray-6 shadow-sm dark:bg-gray-3"
            : "border-transparent hover:bg-gray-3",
        )}
        onClick={onClick}
        type="button"
      >
        <span className="flex items-center gap-2">
          <span className="font-medium font-jp">{word.word}</span>
          <span className="text-sm text-gray-10 font-jp shrink-0">
            {word.reading}
          </span>
        </span>
        <span className="text-sm text-right text-gray-10">{word.meaning}</span>
      </button>
    </li>
  );
}
