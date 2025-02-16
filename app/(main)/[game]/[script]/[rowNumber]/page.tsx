import { getRow } from "@/app/_lib/script";
import clsx from "clsx";
import { Suspense } from "react";
import { getWord } from "./actions";
import type { Params } from "./types";
import { WordList } from "./word-list";
import { WordSearch } from "./word-search";

export default function RowPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ word: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <WordsLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function WordsLoader({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ word: string }>;
}) {
  const { game, script, rowNumber } = params;
  const row = await getRow({
    game,
    scriptId: script,
    rowNumber: Number(rowNumber),
  });
  if (!row?.translation) return null;
  return (
    <div className="h-full flex flex-col">
      <WordList words={row.translation} />
    </div>
  );
}
