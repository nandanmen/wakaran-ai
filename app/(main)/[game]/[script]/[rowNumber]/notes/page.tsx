import { toGameId } from "@/app/_lib/script";
import { getKey } from "@/app/_lib/translation";
import { kv } from "@vercel/kv";
import { Suspense } from "react";
import type { Params } from "../types";
import { NoteForm } from "./form";

export default function NotesPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={null}>
      <NotesLoader params={params} />
    </Suspense>
  );
}

async function NotesLoader({ params }: { params: Params }) {
  const key = `nanda:comments:${getKey({
    gameId: toGameId(params.game),
    scriptId: params.script,
    rowNumber: params.rowNumber,
  })}`;
  const comments = await kv.get<string | null>(key);
  return (
    <NoteForm
      initialValue={comments ?? undefined}
      saveComment={async (comment) => {
        "use server";
        await kv.set(key, comment);
      }}
    />
  );
}
