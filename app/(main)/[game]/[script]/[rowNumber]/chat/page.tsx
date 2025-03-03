import { getRow } from "@/app/_lib/script";
import { Suspense } from "react";
import { Chat } from "../_desktop/chat";
import type { Params } from "../types";

export default function ChatPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <ChatLoader params={params} />
    </Suspense>
  );
}

async function ChatLoader({ params }: { params: Promise<Params> }) {
  const { game, script, rowNumber } = await params;
  const row = await getRow({
    game,
    scriptId: script,
    rowNumber: Number(rowNumber),
  });
  if (!row) return null;
  return <Chat sentence={row.jp.text} />;
}
