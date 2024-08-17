import { getRow, getScript, toGameId, type Game } from "@/app/_lib/script";
import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RowCard, RowCardPlaceholder } from "./row-card";

export default async function DesktopPage({
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
    <div className="grid grid-cols-[300px_1fr] gap-4 bg-sand-2 dark:bg-sand-1 p-4">
      <div className="-mt-4">
        <header className="sticky top-0 py-4 bg-sand-2 dark:bg-sand-1">
          <h1 className="font-medium">Trails in the Sky</h1>
        </header>
        <ul className="divide-y divide-gray-6 divide-dashed">
          {script.map((row) => {
            const active = row.row === Number(rowNumber);
            return (
              <li className="first:-mt-4" key={row.row}>
                <Link
                  className={clsx(
                    "overflow-hidden block py-4",
                    active ? "" : "text-gray-9"
                  )}
                  href={`/${game}/${scriptId}/${row.row}`}
                  scroll={false}
                >
                  <span
                    className={clsx(
                      "text-sm flex gap-1",
                      active ? "text-gray-11 mb-1" : ""
                    )}
                  >
                    <span className="font-jp">{row.jpnChrName}</span>•
                    <span>{row.engChrName}</span>
                  </span>
                  {active && (
                    <span className="font-jp">
                      {row.jpnSearchText.replaceAll("<br/>", "")}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Suspense fallback={<RowCardPlaceholder />}>
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
  return <RowCard row={row} />;
}
