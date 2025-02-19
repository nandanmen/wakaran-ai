import { useEffect, useId, useState } from "react";
import { isKanji } from "wanakana";
import type { KanjiEntry } from "../_lib/dictionary";
import { BackgroundDots } from "../_components/background-dots";

export function QuizSidebar({
  submitted,
  word,
}: {
  submitted: boolean;
  word: string;
}) {
  const [entries, setEntries] = useState<KanjiEntry[]>([]);

  useEffect(() => {
    setEntries([]);
    if (![...word].some(isKanji)) return;
    fetch(`/api/kanji?word=${word}`)
      .then((res) => res.json())
      .then(({ kanjis }) => setEntries(kanjis));
  }, [word]);

  if (!submitted) {
    return (
      <aside className="relative">
        <div className="absolute inset-4 text-gray-6">
          <BackgroundDots />
        </div>
      </aside>
    );
  }
  return (
    <ul className="grid grid-cols-2">
      {entries.filter(Boolean).map((entry) => (
        <li key={entry.text}>
          <a
            className="flex flex-col hover:bg-gray-3"
            href={`https://jisho.org/search/${entry.text}%20%23kanji`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-[40px] font-medium font-jp items-center justify-center flex flex-col aspect-square p-4">
              <span className="text-sm text-gray-11">
                {entry.onyomi.join(", ")}
              </span>
              <span className="leading-none">{entry.text}</span>
            </p>
            <div className="text-sm text-center px-2 text-gray-11">
              <p>{entry.meanings.slice(0, 2).join(", ")}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
