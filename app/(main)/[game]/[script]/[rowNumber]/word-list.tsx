import type { Word as WordType } from "@/app/_lib/translation";
import { Word } from "./word";

export function WordList({
	words,
	activeWord,
}: {
	words: WordType[];
	activeWord: string | null;
}) {
	const uniqueWords = (() => {
		const seen = new Set<string>();
		const results: WordType[] = [];
		for (const word of words) {
			if (seen.has(word.word)) continue;
			results.push(word);
			seen.add(word.word);
		}
		return results;
	})();
	return (
		<ul className="grow overflow-y-auto row-span-2">
			{uniqueWords.map((word, index) => {
				const match =
					activeWord === word.word || activeWord === word.dictionary;
				return (
					<Word
						active={activeWord ? match : false}
						key={word.word}
						word={word}
					/>
				);
			})}
		</ul>
	);
}
