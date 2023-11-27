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
import { ChatForm } from "./chat";

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
      className="border h-fit w-full rounded-xl divide-y divide-gray-7 border-gray-7 sticky top-8"
      key={text}
    >
      <ChatForm sentence={text} />
      <CommentForm
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
            <div className="p-4 flex items-center justify-between">
              <p className="text-2xl">{word.word}</p>
              <p className="text-gray-11">{word.reading}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
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

async function CommentForm({
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
    <>
      {comment && (
        <div className="p-4 space-y-2">
          <h3 className="text-gray-11 font-medium text-sm">Notes</h3>
          <p>{comment}</p>
        </div>
      )}
      <Edit>
        <form
          action={async (data: FormData) => {
            "use server";
            const context = {
              gameId: data.get("gameId") as string,
              scriptId: data.get("scriptId") as string,
              row: parseInt(data.get("row") as string),
            };
            await saveComment(data.get("comment") as string, context);
            revalidatePath(currentPath);
          }}
          className="flex flex-col divide-y divide-gray-7"
        >
          <textarea
            className="bg-gray-1 h-[100px] p-4 resize-y placeholder:text-gray-10"
            name="comment"
            defaultValue={comment}
            placeholder="Leave some notes about this text..."
          />
          <input type="hidden" value={gameId} name="gameId" />
          <input type="hidden" value={scriptId} name="scriptId" />
          <input type="hidden" value={row} name="row" />
          <div className="p-4">
            <SubmitButton>Add Comment</SubmitButton>
          </div>
        </form>
      </Edit>
    </>
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
      className="aspect-square h-full flex items-center px-4"
    >
      <input type="hidden" value={JSON.stringify(word)} name="word" />
      <FavouriteButton favourited={favourited} />
    </form>
  );
}
