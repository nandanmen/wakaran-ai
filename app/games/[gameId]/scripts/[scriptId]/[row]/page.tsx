import { getScript } from "@/app/_lib/script";
import { getTranslation } from "@/app/games/[gameId]/scripts/[scriptId]/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatForm } from "./chat";

type Row = {
  gameId: number;
  fname: string;
  scene: string | null;
  row: number;
  engChrName: string;
  engSearchText: string;
  jpnChrName: string;
  jpnHtmlText: string;
  jpnSearchText: string;
  opName: string;
  pcIconHtml: string;
  evoIconHtml: string;
};

async function getRow({
  gameId,
  scriptId,
  row,
}: {
  gameId: string;
  scriptId: string;
  row: string;
}): Promise<Row | undefined> {
  const script = await getScript({ gameId, scriptId });
  const rowNumber = parseInt(row);
  return script.at(rowNumber - 1);
}

export default async function RowPage({
  params,
}: {
  params: { gameId: string; scriptId: string; row: string };
}) {
  const row = await getRow(params);
  if (!row) notFound();

  const translation = await getTranslation(row.jpnSearchText, {
    ...params,
    row: row.row,
  });
  return (
    <div className="p-8 min-h-[calc(100vh-96px)] flex flex-col">
      <section className="bg-sand-1 rounded-xl border border-sand-4 relative">
        <header className="space-y-1 p-4">
          <p className="text-sand-11">{row.jpnChrName}</p>
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{ __html: row.jpnHtmlText }}
          />
        </header>
        <div className="p-4 space-y-1 border-t border-dashed border-sand-4 relative">
          <p className="text-sand-11">{row.engChrName}</p>
          <p>{row.engSearchText}</p>
          <Link
            className="w-10 h-10 flex items-center justify-center bg-sand-1 rounded-full absolute border border-sand-4 -top-5 -left-6"
            href={`/games/${params.gameId}/scripts/${params.scriptId}/${
              row.row - 1
            }`}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M10.25 6.75L4.75 12L10.25 17.25"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19.25 12H5"
              ></path>
            </svg>
          </Link>
          <Link
            className="w-10 h-10 flex items-center justify-center bg-sand-1 rounded-full absolute border border-sand-4 -top-5 -right-6"
            href={`/games/${params.gameId}/scripts/${params.scriptId}/${
              row.row + 1
            }`}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M13.75 6.75L19.25 12L13.75 17.25"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 12H4.75"
              ></path>
            </svg>
          </Link>
        </div>
      </section>
      <section className="mt-6 grow">
        <h2 className="font-medium text-sand-11 text-sm">Components</h2>
        <ul className="mt-2 border border-sand-4 rounded-xl divide-y divide-sand-4 divide-dashed">
          {translation.words
            .filter((word) => word.type !== "particle")
            .map((word) => {
              return (
                <li key={word.word} className="flex gap-1 p-4">
                  <p>{word.word}</p>
                  <p className="text-sand-11">{word.reading}</p>
                  <p className="text-sm text-sand-11 ml-auto">{word.meaning}</p>
                </li>
              );
            })}
        </ul>
      </section>
      <ChatForm sentence={row.jpnSearchText} />
    </div>
  );
}
