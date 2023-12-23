import { getScript } from "@/app/_lib/script";
import { FavouriteButton, Script, SubmitButton, type Word } from "./script";
import {
  addToFavourite,
  getComment,
  isFavourite,
  saveComment,
} from "./actions";
import { revalidatePath } from "next/cache";
import { marked } from "marked";
import { ChatForm } from "./chat";
import { CommentForm } from "./comment";
import { Fragment, Suspense } from "react";
import { search } from "@/app/_lib/dictionary";
import { getSentence, updateSentenceTranslation } from "@/app/_lib/sentences";
import { notFound } from "next/navigation";
import { TranslationItem } from "./translation-item";
import { addWordsToSentence } from "@/app/_lib/words";

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
        <Suspense fallback={null}>
          <TranslationWrapper
            gameId={gameId}
            scriptId={scriptId}
            row={rowNumber}
            text={script.at(rowNumber - 1).jpnSearchText}
          />
        </Suspense>
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
  const currentPath = `/games/${gameId}/scripts/${scriptId}?row=${row}`;
  return (
    <ul
      className="border h-fit max-h-[calc(100vh-theme(space.8)*2)] overflow-y-auto w-full rounded-xl divide-y divide-gray-7 border-gray-7 sticky top-8"
      key={text}
    >
      <li>{text.replaceAll("<br/>", "")}</li>
      <ChatForm sentence={text} />
      <CommentFormWrapper
        gameId={gameId}
        row={row}
        scriptId={scriptId}
        currentPath={currentPath}
      />
      <Suspense fallback={null}>
        <Translation gameId={gameId} scriptId={scriptId} row={row} />
      </Suspense>
    </ul>
  );
}

async function Translation({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: number;
}) {
  const sentence = await getSentence({ gameId, scriptId, row });
  if (!sentence) notFound();
  const { translation } = sentence;
  const currentPath = `/games/${gameId}/scripts/${scriptId}?row=${row}`;
  return (
    <>
      <li>
        <form
          action={async (data) => {
            "use server";
            const entries = data
              .getAll("entry")
              .map((v) => JSON.parse(v as string));
            const sentence = data.get("sentence") as string;
            const gameId = data.get("gameId") as string;
            const scriptId = data.get("scriptId") as string;
            const row = parseInt(data.get("row") as string);
            const args = entries.map((v) => {
              return {
                entry: {
                  meanings: v.entry.meanings,
                  readings: v.entry.readings,
                  text: v.entry.text,
                  part_of_speech: v.word.type,
                  wanikani_id: v.entry.wanikani ? v.entry.id : undefined,
                },
                text: v.word.word,
                form: v.word.form,
                offset: sentence.indexOf(v.word.word),
              };
            });
            await addWordsToSentence(args, { gameId, scriptId, row });
          }}
          className="divide-y divide-gray-7"
        >
          {translation.map((word) => {
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
                  <FavouriteForm word={word} currentPath={currentPath} />
                </li>
                <Suspense fallback={null}>
                  <TranslationItemWrapper word={word} />
                </Suspense>
              </Fragment>
            );
          })}
          <input type="hidden" name="gameId" value={gameId} />
          <input type="hidden" name="scriptId" value={scriptId} />
          <input type="hidden" name="row" value={row} />
          <input type="hidden" name="sentence" value={sentence.jp_text} />
          <div className="p-4">
            <SubmitButton>Save to DB</SubmitButton>
          </div>
        </form>
      </li>
      <li>
        <form
          action={async (data) => {
            "use server";
            const json = data.get("translation") as string;
            await updateSentenceTranslation(JSON.parse(json), {
              gameId,
              scriptId,
              row,
            });
          }}
          className="divide-y divide-gray-7"
        >
          <textarea
            className="w-full p-4 font-mono h-[400px] text-sm bg-gray-1"
            name="translation"
            defaultValue={JSON.stringify(translation, null, 2)}
          />
          <div className="p-4">
            <SubmitButton>Update</SubmitButton>
          </div>
        </form>
      </li>
    </>
  );
}

async function TranslationItemWrapper({ word }: { word: Word }) {
  const searchText = word.dictionary || word.word;
  const entries = word.type !== "particle" && (await search(searchText));
  return entries ? <TranslationItem word={word} entries={entries} /> : null;
}

async function CommentFormWrapper({
  gameId,
  scriptId,
  row,
  currentPath,
}: {
  gameId: string;
  scriptId: string;
  row: number;
  currentPath: string;
}) {
  const comment = await getComment({ gameId, scriptId, row });
  return (
    <CommentForm
      currentComment={
        comment
          ? {
              html: await marked.parse(comment),
              text: comment,
            }
          : undefined
      }
      saveComment={async (data: FormData) => {
        "use server";
        const context = {
          gameId: data.get("gameId") as string,
          scriptId: data.get("scriptId") as string,
          row: parseInt(data.get("row") as string),
        };
        await saveComment(data.get("comment") as string, context);
        revalidatePath(currentPath);
      }}
      context={{ gameId, scriptId, row }}
    />
  );
}

async function FavouriteForm({
  word,
  currentPath,
}: {
  word: Word;
  currentPath: string;
}) {
  const favourited = await isFavourite(word);
  return (
    <form
      action={async (data: FormData) => {
        "use server";
        await addToFavourite(JSON.parse(data.get("word") as string));
        revalidatePath(currentPath);
      }}
      className="h-full flex items-center px-2"
    >
      <input type="hidden" value={JSON.stringify(word)} name="word" />
      <FavouriteButton favourited={favourited} />
    </form>
  );
}
