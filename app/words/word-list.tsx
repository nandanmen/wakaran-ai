"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { SavedWord } from "../quiz/types";
import clsx from "clsx";

export function WordList({ words }: { words: SavedWord[] }) {
  const { id } = useParams();
  return (
    <ul className="overflow-y-auto h-full">
      {words.map((word) => {
        return (
          <li key={word.id}>
            <Link
              className={clsx(
                "h-10 flex items-center px-4 font-jp hover:bg-gray-3",
                id === word.id && "bg-gray-3",
              )}
              href={`/words/${word.id}`}
            >
              {word.word}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
