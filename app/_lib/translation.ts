import { shouldFetchLocal } from "./config";
import * as local from "./local";

export const getKey = ({
	gameId,
	scriptId,
	rowNumber,
}: {
	gameId: string;
	scriptId: string;
	rowNumber: number | string;
}) => `${gameId}:${scriptId}:${rowNumber}`;

async function get(key: string) {
	if (shouldFetchLocal) return local.getTranslation(key);
	const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
		cache: "no-store",
		headers: {
			Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
		},
	});
	const { result } = await response.json();
	try {
		return JSON.parse(result);
	} catch {
		return result;
	}
}

export type Word = {
	word: string;
	meaning: string;
	reading: string;
	type: string;
	form: string;
	dictionary: string;
};

export async function getTranslation({
	gameId,
	scriptId,
	rowNumber,
}: {
	gameId: string;
	scriptId: string;
	rowNumber: number;
}): Promise<{ words: Word[] } | undefined> {
	const key = getKey({ gameId, scriptId, rowNumber });
	return get(key);
}
