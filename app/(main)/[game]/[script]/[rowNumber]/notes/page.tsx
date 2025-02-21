import { toGameId } from "@/app/_lib/script";
import { getKey } from "@/app/_lib/translation";
import { kv } from "@vercel/kv";
import { Suspense } from "react";
import type { Params } from "../types";
import { NoteForm } from "./form";
import { Notes } from "@/app/words/[id]/notes";

export default function NotesPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <NotesLoader params={params} />
    </Suspense>
  );
}

async function NotesLoader({ params }: { params: Promise<Params> }) {
  const { game, script, rowNumber } = await params;
  const key = `nanda:comments:${getKey({
    gameId: toGameId(game),
    scriptId: script,
    rowNumber,
  })}`;
  const comments = await kv.get<string | null>(key);
  return (
    <Notes
      initialValue={comments ?? ""}
      onSave={async (comment) => {
        "use server";
        await kv.set(key, comment);
      }}
    />
  );
}
