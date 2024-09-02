import { getRow } from "@/app/_lib/script";
import { Params } from "./types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Word } from "./word";

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
  if (!row.translation) return null;
  return (
    <ul>
      {row.translation.map((word) => {
        return <Word key={word.word} word={word} />;
      })}
    </ul>
  );
}
