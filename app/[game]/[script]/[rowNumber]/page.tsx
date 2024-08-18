import { getRow } from "@/app/_lib/script";
import { Params } from "./types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function RowPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={null}>
      <WordsLoader params={params} />
    </Suspense>
  );
}

async function WordsLoader({ params }: { params: Params }) {
  const { game, script, rowNumber } = params;
  const row = await getRow({
    game,
    scriptId: script,
    rowNumber: Number(rowNumber),
  });
  if (!row) notFound();
  return (
    <ul>
      {row.translation.map((word) => {
        return (
          <li
            className="py-2 flex hover:bg-sand-3 rounded-md justify-between items-center"
            key={word.word}
          >
            <p className="font-medium">{word.word}</p>
            <p className="text-xs text-sand-11">{word.meaning}</p>
          </li>
        );
      })}
    </ul>
  );
}
