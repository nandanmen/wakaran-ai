import { getScript } from "@/app/_lib/script";
import {
  Edit,
  FavouriteButton,
  Script,
  SubmitButton,
  type Word,
} from "./script";
import {
  addToFavourite,
  getComment,
  getTranslation,
  isFavourite,
  saveComment,
} from "./actions";
import { revalidatePath } from "next/cache";
import { marked } from "marked";
import { ChatForm } from "./chat";
import { CommentForm } from "./comment";

export const dynamic = "force-dynamic";

export default async function ScriptPage({
  params: { gameId, scriptId },
  searchParams,
}: {
  params: { gameId: string; scriptId: string };
  searchParams?: { row: string };
}) {
  const script = await getScript({ gameId, scriptId });
  const rowNumber = parseInt(searchParams?.row ?? "");
  return (
    <div className="p-8 lg:px-12 flex gap-8">
      <Script script={script} />
      {!isNaN(rowNumber) && (
        <Translation
          gameId={gameId}
          scriptId={scriptId}
          row={rowNumber}
          text={script.at(rowNumber - 1).jpnSearchText}
        />
      )}
    </div>
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
  const currentPath = `/games/${gameId}/scripts/${scriptId}?row=${row}`;
  return (
    <ul
      className="border h-fit max-h-[calc(100vh-theme(space.8)*2)] overflow-y-auto w-full rounded-xl divide-y divide-gray-7 border-gray-7 sticky top-8"
      key={text}
    >
      <ChatForm sentence={text} />
      <CommentFormWrapper
        gameId={gameId}
        row={row}
        scriptId={scriptId}
        currentPath={currentPath}
      />
      {translation.words.map((word) => {
        return (
          <li
            className="grid grid-cols-[1fr_1fr_min-content] divide-x divide-gray-7 items-center"
            key={word.word}
          >
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
        );
      })}
    </ul>
  );
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
