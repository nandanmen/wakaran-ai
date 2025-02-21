import { NoteForm } from "@/app/(main)/[game]/[script]/[rowNumber]/notes/form";
import { BackgroundDots } from "@/app/_components/background-dots";
import { searchForKanji } from "@/app/_lib/dictionary";
import { getSavedWord } from "@/app/_lib/saved";
import { sb } from "@/app/_lib/supabase";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isKanji } from "wanakana";
import { Notes } from "./notes";

export default async function WordPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const word = await getSavedWord((await params).id);
  if (!word) notFound();
  return (
    <div className="flex">
      <div className="grow border-r border-gray-6 flex flex-col">
        <div className="flex items-center justify-center grow">
          <h1 className="font-jp flex items-end">
            {word.metadata.reading.map((r) => {
              return (
                <span className="flex flex-col items-center gap-1" key={r.text}>
                  <span className="text-lg">{r.reading}</span>
                  <span className="text-5xl font-medium">{r.text}</span>
                </span>
              );
            })}
          </h1>
        </div>
        <div className="border-t border-gray-6">
          <header className="p-4 -mb-2 pb-0">
            <h3 className="text-sm font-medium">Examples</h3>
          </header>
          <ul className="divide-y divide-gray-6 divide-dashed">
            {word.examples.map((e) => {
              return (
                <li className="p-4" key={e.id}>
                  <div className="space-y-1">
                    {e.jp.character && (
                      <p className="text-gray-11 text-sm flex items-end gap-1">
                        <span className="font-jp">{e.jp.character}</span>
                        <span>•</span>
                        <span>{e.en.character}</span>
                      </p>
                    )}
                    <p className="font-jp text-lg">
                      {e.parts.map((p, i) => {
                        return (
                          <span
                            className={
                              p.type === "word"
                                ? "text-blue-9 font-medium"
                                : undefined
                            }
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={i}
                          >
                            {p.text}
                          </span>
                        );
                      })}
                    </p>
                    <p className="text-sm text-gray-11">{e.en.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <aside className="shrink-0 w-[450px] h-[calc(100vh-34px)] flex flex-col divide-y divide-gray-6">
        <section className="p-4">
          <p className="py-1 px-3 text-blue-11 text-sm w-fit rounded-full font-medium bg-blue-5">
            Top {word.metadata.ranking}
          </p>
        </section>
        <section className="p-4">
          <h3 className="text-sm font-medium mb-2">Meanings</h3>
          <ul className="list-disc pl-4">
            {word.metadata.meanings.slice(0, 5).map((m) => {
              return <li key={m}>{m}</li>;
            })}
          </ul>
        </section>
        <Suspense
          fallback={
            <div className="p-4 grow relative text-gray-6">
              <BackgroundDots />
            </div>
          }
        >
          <KanjiLoader word={word.text} />
          <NotesLoader id={word.id} />
        </Suspense>
      </aside>
    </div>
  );
}

async function NotesLoader({ id }: { id: string }) {
  const note = await sb
    .from("word_notes")
    .select("contents")
    .eq("word_id", id)
    .eq("user_id", "nanda.s@hey.com")
    .single();
  return (
    <section className="p-4 flex flex-col grow">
      <Notes
        initialValue={note.data?.contents}
        onSave={async (comment) => {
          "use server";
          if (!comment) return;
          await sb.from("word_notes").upsert({
            word_id: id,
            user_id: "nanda.s@hey.com",
            contents: comment,
          });
        }}
      />
    </section>
  );
}

async function KanjiLoader({ word }: { word: string }) {
  const kanjis = [...word].filter(isKanji);
  if (!kanjis.length) return null;
  const results = await Promise.all(kanjis.map(searchForKanji));
  return (
    <section className="p-4">
      <h3 className="text-sm font-medium">Kanji</h3>
      <ul className="space-y-1">
        {results.flat().map((r) => {
          if (!r) return null;
          return (
            <li className="flex gap-4" key={r.text}>
              <p className="font-jp text-[32px] font-medium">{r.text}</p>
              <div className="py-1 space-y-1">
                <p className="font-jp">
                  {r.onyomi.length > 0
                    ? r.onyomi.join(", ")
                    : r.kunyomi.join(", ")}
                </p>
                <p className="leading-tight">{r.meanings.join(", ")}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
