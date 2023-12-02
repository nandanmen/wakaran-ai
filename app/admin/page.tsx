import { getScript } from "@/app/_lib/script";
import { Script, Word } from "../games/[gameId]/scripts/[scriptId]/script";
import { getTranslation } from "../games/[gameId]/scripts/[scriptId]/actions";
import { search } from "../_lib/dictionary";
import { Fragment, Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ScriptPage({
  searchParams,
}: {
  searchParams?: { row: string };
}) {
  const gameId = "1";
  const scriptId = "c0100";
  const script = await getScript({ gameId, scriptId });
  const rowNumber = parseInt(searchParams?.row ?? "");
  return (
    <div className="p-8 lg:px-12 flex gap-8">
      <Script script={script} />
      {!isNaN(rowNumber) && (
        <TranslationWrapper
          gameId={gameId}
          scriptId={scriptId}
          row={rowNumber}
          text={script.at(rowNumber - 1).jpnSearchText}
        />
      )}
    </div>
  );
}

function TranslationWrapper({
  gameId,
  scriptId,
  row,
  text,
}: {
  gameId: string;
  scriptId: string;
  row: number;
  text: string;
}) {
  return (
    <ul
      className="border h-fit max-h-[calc(100vh-theme(space.8)*2)] overflow-y-auto w-full rounded-xl divide-y divide-gray-7 border-gray-7 sticky top-8"
      key={text}
    >
      <li className="p-4">{text.replaceAll("<br/>", "")}</li>
      <Suspense fallback={null}>
        <Translation
          text={text}
          gameId={gameId}
          scriptId={scriptId}
          row={row}
        />
      </Suspense>
    </ul>
  );
}

async function Translation({
  gameId,
  scriptId,
  row,
  text,
}: {
  gameId: string;
  scriptId: string;
  row: number;
  text: string;
}) {
  const translation = await getTranslation(text, { gameId, scriptId, row });
  return (
    <>
      {translation.words.map((word) => {
        return (
          <Fragment key={word.word}>
            <li className="grid grid-cols-[1fr_1fr_min-content] divide-x divide-gray-7 items-center">
              <div className="px-4 py-2 flex items-center justify-between">
                <p className="text-lg">{word.word}</p>
                <p className="text-gray-11">{word.reading}</p>
              </div>
              <div className="px-4 py-2 flex items-center justify-between">
                <p>{word.meaning}</p>
                <div className="flex gap-2">
                  <p className="text-sm text-gray-11 bg-gray-3 w-fit px-2 py-1 rounded-md">
                    {word.type}
                  </p>
                  {word.form && (
                    <p className="text-sm text-gray-11 bg-gray-3 w-fit px-2 py-1 rounded-md">
                      {word.form}
                    </p>
                  )}
                </div>
              </div>
            </li>
            <Suspense fallback={null}>
              <TranslationItem word={word} />
            </Suspense>
          </Fragment>
        );
      })}
      <li>
        <textarea
          className="w-full font-mono h-[300px]"
          value={JSON.stringify(translation, null, 2)}
        />
      </li>
    </>
  );
}

async function TranslationItem({ word }: { word: Word }) {
  const response =
    word.type !== "particle" && (await search(word.dictionary || word.word));
  return (
    <>
      {response &&
        response.map((entry) => {
          return (
            <li
              key={entry.id}
              className="p-4 bg-gray-2 flex justify-between text-sm"
            >
              <span className="flex gap-2">
                <span>{entry.text}</span>
                <span>{entry.readings?.join(",")}</span>
                <span>{entry.meanings.join(",")}</span>
              </span>
              <span className="flex gap-2">
                <a
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://jisho.org/word/${entry.text}`}
                >{`Jisho ->`}</a>
                <button>Save to DB</button>
              </span>
            </li>
          );
        })}
    </>
  );
}
