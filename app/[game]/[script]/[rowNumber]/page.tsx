import { getRow } from "@/app/_lib/script";
import { Params } from "./types";
import { Suspense } from "react";
import { WordList } from "./word-list";
import clsx from "clsx";
import { WordSearch } from "./word-search";
import { getWord } from "./actions";

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
  const activeWord = (await searchParams).word;
  return (
    <div
      className={clsx(
        "shrink min-h-0 grid",
        activeWord ? "grid-rows-3" : "grid-rows-2"
      )}
    >
      <WordList words={row.translation} activeWord={activeWord} />
      {activeWord && <WordSearchLoader word={activeWord} />}
    </div>
  );
}

async function WordSearchLoader({ word }: { word: string }) {
  const entries = await getWord(word);
  return <WordSearch word={word} entries={entries} />;
}
