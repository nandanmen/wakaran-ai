import { getRow } from "@/app/_lib/script";
import { Suspense } from "react";
import type { Params } from "./types";
import { WordList } from "./word-list";

export default async function RowPage({
  params: p,
}: {
  params: Promise<Params>;
}) {
  const params = await p;
  return (
    <Suspense fallback={null}>
      <WordsLoader params={params} />
    </Suspense>
  );
}

async function WordsLoader({
  params,
}: {
  params: Params;
}) {
  const { game, script, rowNumber } = params;
  const row = await getRow({
    game,
    scriptId: script,
    rowNumber: Number(rowNumber),
  });
  if (!row?.translation) return null;
  return (
    <div className="h-[calc(100%-20px)] flex flex-col gap-4">
      <WordList words={row.translation} />
    </div>
  );
}
