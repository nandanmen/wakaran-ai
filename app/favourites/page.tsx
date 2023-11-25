import { kv } from "@vercel/kv";
import { WordItem } from "./word-item";
import type { Word } from "../games/[gameId]/scripts/[scriptId]/script";

export const dynamic = "force-dynamic";

export default async function Favourites() {
  const words = await kv.keys("nanda:favourites:*");
  return (
    <ul className="max-w-[600px] mx-auto my-16 border border-gray-7 divide-gray-7 lg:rounded-xl divide-y overflow-hidden">
      {words.map((key) => (
        <Word key={key} keyName={key} />
      ))}
    </ul>
  );
}

async function Word({ keyName }: { keyName: string }) {
  const word = await kv.get<Word>(keyName);
  if (!word) return null;
  return <WordItem word={word} />;
}
