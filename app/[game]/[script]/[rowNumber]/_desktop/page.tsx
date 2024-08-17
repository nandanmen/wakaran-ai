import { getRow, getScript, toGameId, type Game } from "@/app/_lib/script";
import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Furigana } from "../row-text";

export async function DesktopPage({
  params: { game, script: scriptId, rowNumber },
}: {
  params: {
    game: Game;
    script: string;
    rowNumber: string;
  };
}) {
  const script = await getScript({ gameId: toGameId(game), scriptId });
  if (!script) notFound();
  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 bg-sand-2 p-4">
      <div className="-mt-4">
        <header className="sticky top-0 pt-4 pb-2 bg-sand-2">
          <h1 className="font-medium">Trails in the Sky</h1>
        </header>
        <ul className="divide-y divide-gray-6 divide-dashed">
          {script.map((row) => {
            const active = row.row === Number(rowNumber);
            return (
              <li className="first:-mt-4" key={row.row}>
                <Link
                  className={clsx(
                    "p-4 overflow-hidden",
                    active ? "" : "text-gray-9"
                  )}
                  href={`/${game}/${scriptId}/${row.row}`}
                  scroll={false}
                >
                  <p
                    className={clsx(
                      "text-sm flex gap-1 mb-1",
                      active ? "text-gray-11" : ""
                    )}
                  >
                    <span className="font-jp">{row.jpnChrName}</span>•
                    <span>{row.engChrName}</span>
                  </p>
                  <p className="font-jp">
                    {row.jpnSearchText.replaceAll("<br/>", "")}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Suspense fallback={null}>
        <Translation params={{ game, script: scriptId, rowNumber }} />
      </Suspense>
    </div>
  );
}

async function Translation({
  params: { game, script: scriptId, rowNumber },
}: {
  params: {
    game: Game;
    script: string;
    rowNumber: string;
  };
}) {
  const row = await getRow({
    game,
    scriptId,
    rowNumber: Number(rowNumber),
  });
  if (!row) notFound();
  return (
    <div className="sticky top-4 h-[calc(100vh-theme(space.8))] grid grid-cols-[1fr_300px] gap-4">
      <main className="flex items-center justify-center h-full relative bg-sand-1 rounded-lg border border-sand-6">
        <div className="max-w-[600px] space-y-2">
          <p className="font-jp text-lg">{row.jp.name}</p>
          <Furigana
            className="text-3xl font-medium font-jp leading-normal"
            text={row.jp.text.trim()}
            translation={row.translation}
            open
          />
          <div className="absolute bottom-6 max-w-[600px] text-sand-11 left-1/2 -translate-x-1/2 text-sm space-y-2">
            <p>{row.en.name}</p>
            <p>{row.en.text}</p>
          </div>
        </div>
      </main>
      <aside className="h-full overflow-y-auto">
        <ul>
          {row.translation.map((word) => {
            return (
              <li
                className="p-2 flex hover:bg-gray-1 rounded-md justify-between items-center"
                key={word.word}
              >
                <p className="font-medium">{word.word}</p>
                <p className="text-xs text-gray-11">{word.meaning}</p>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
