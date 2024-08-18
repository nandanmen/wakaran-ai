import { getRow } from "@/app/_lib/script";
import { Params } from "../types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Chat } from "../_desktop/chat";

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
  if (!row) notFound();
  return <Chat sentence={row.jp.text} />;
}
