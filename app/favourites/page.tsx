import { kv } from "@vercel/kv";
import type { Word } from "../games/[gameId]/scripts/[scriptId]/script";
import { WordItem } from "./word-item";

export const dynamic = "force-dynamic";

export default async function Favourites() {
	const words = await kv.keys("nanda:favourites:*");
	return (
		<ul className="m-8 md:m-16 grid grid-cols-[repeat(auto-fit,_minmax(min(500px,100%),1fr))] gap-4 overflow-hidden">
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
