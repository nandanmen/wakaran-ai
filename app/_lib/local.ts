import path from "path";
import * as fs from "fs/promises";
import { cache } from "react";

export const getTranslation = cache(async function getTranslation(key: string) {
	const [, scriptId] = key.split(":");
	const file = await fs.readFile(
		path.join(process.cwd(), "translation", `${scriptId}.json`),
		"utf-8",
	);
	const parsed = JSON.parse(file);
	return parsed[key];
});

export const getScript = cache(async function getScript(scriptId: string) {
	const file = await fs.readFile(
		path.join(process.cwd(), "scripts", `${scriptId}.json`),
		"utf-8",
	);
	const parsed = JSON.parse(file);
	return parsed;
});

type DictionaryEntry = {
	id: string;
	kanji: Array<{
		common: boolean;
		text: string;
	}>;
	kana: Array<{
		common: boolean;
		text: string;
		appliesToKanji: string[];
	}>;
	sense: Array<{
		gloss: Array<{ text: string }>;
	}>;
};

export const findEntry = cache(async function findEntry(word: string) {
	const dictionary = JSON.parse(
		await fs.readFile(
			path.join(process.cwd(), "data/dictionary.json"),
			"utf-8",
		),
	);
	const entries = dictionary.words.filter((entry: DictionaryEntry) => {
		return (
			entry.kanji.some((k) => k.common && k.text === word) ||
			entry.kana.some((k) => k.common && k.text === word)
		);
	});
	return entries.map((entry: DictionaryEntry) => {
		return {
			readings: entry.kana.filter((k) => k.common).map((k) => k.text),
			meanings: entry.sense.flatMap((s) => s.gloss.map((g) => g.text)),
		};
	});
});

/**
 * `loc` points to a specific usage of the word in game text in the format `{gameId}:{scriptId}:{row}:{offset}`.
 */
export async function saveWord(word: string, loc: string) {
	const filePath = path.join(process.cwd(), "data/words.json");
	const list = JSON.parse(await fs.readFile(filePath, "utf-8"));
	const saved = list[word];
	if (saved) {
		if (saved.loc.includes(loc)) return;
		saved.loc = [...saved.loc, loc];
		return fs.writeFile(
			filePath,
			JSON.stringify({ ...list, [word]: saved }, null, 2),
		);
	}
	const entries = await findEntry(word);
	if (entries.length) {
		return fs.writeFile(
			filePath,
			JSON.stringify(
				{
					...list,
					[word]: {
						loc: [loc],
						entries,
					},
				},
				null,
				2,
			),
		);
	}
	console.log(`Could not find dictionary entries for ${word}`);
}
