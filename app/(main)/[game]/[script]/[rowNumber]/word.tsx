"use client";

import type { Word } from "@/app/_lib/translation";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";

export function Word({ word, active }: { word: Word; active: boolean }) {
	const params = useParams();
	if (!word.meaning) return null;
	if (word.type === "particle") return null;
	return (
		<li>
			<Link
				href={`/${params.game}/${params.script}/${params.rowNumber}?word=${
					word.dictionary ?? word.word
				}`}
				className={clsx(
					"flex justify-between items-center h-10 px-2.5 rounded-md w-full border",
					active
						? "bg-gray-1 border-gray-6 shadow-sm dark:bg-gray-3"
						: "border-transparent hover:bg-gray-3",
				)}
			>
				<span className="flex items-center gap-2">
					<span className="font-medium font-jp">{word.word}</span>
					<span className="text-sm text-gray-10 font-jp">{word.reading}</span>
				</span>
				<p className="text-sm text-gray-10">{word.meaning}</p>
			</Link>
		</li>
	);
}
