import Link from "next/link";
import { Suspense } from "react";
import { sql } from "../_lib/sql";
import type { SavedWord } from "../quiz/types";

export const dynamic = "force-dynamic";

export default function WordsPage() {
  return (
    <div className="p-8">
      <Link href="/sky" className="text-sand-11 hover:underline block mb-8">
        Trails in the Sky
      </Link>
      <main className="max-w-[900px] mx-auto">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-medium mb-4">Saved Words</h1>
          <Link href="/quiz">Quiz -{">"}</Link>
        </header>
        <Suspense fallback={<p>Loading...</p>}>
          <WordsList />
        </Suspense>
      </main>
    </div>
  );
}

async function WordsList() {
  const words = await sql<SavedWord[]>`
    select * from saved
    inner join dictionary on word_id = dictionary.id
    where user_id = 'nanda.s@hey.com'
    order by saved.created_at desc
  `;
  return (
    <ul className="flex flex-wrap gap-2">
      {words.map((word) => {
        return (
          <li
            className="h-16 min-w-16 bg-sand-1 rounded-xl text-2xl flex items-center px-4 w-fit font-jp"
            key={word.id}
          >
            {word.word}
          </li>
        );
      })}
    </ul>
  );
}
