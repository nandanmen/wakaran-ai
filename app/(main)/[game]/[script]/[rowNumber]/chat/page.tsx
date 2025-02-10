import { getRow } from "@/app/_lib/script";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Chat } from "../_desktop/chat";
import type { Params } from "../types";

export default function ChatPage({ params }: { params: Params }) {
	return (
		<Suspense fallback={null}>
			<ChatLoader params={params} />
		</Suspense>
	);
}

async function ChatLoader({ params }: { params: Params }) {
	const { game, script, rowNumber } = params;
	const row = await getRow({
		game,
		scriptId: script,
		rowNumber: Number(rowNumber),
	});
	if (!row) return null;
	return <Chat sentence={row.jp.text} />;
}
