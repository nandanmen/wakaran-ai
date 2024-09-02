import { Suspense } from "react";
import { sql } from "../_lib/sql";
import Link from "next/link";

export default function WordsPage() {
  return (
    <div className="p-8">
      <Link href="/sky" className="text-sand-11 hover:underline block mb-8">
        Trails in the Sky
      </Link>
      <main className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-medium mb-4">Saved Words</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <WordsList />
        </Suspense>
      </main>
    </div>
  );
}

interface Word {
  id: string;
  text: string;
  meanings: string[];
  readings: string[];
  created_at: Date;
}

async function WordsList() {
  const words = await sql<Word[]>`SELECT * FROM words`;
  return (
    <ul className="flex flex-wrap gap-2">
      {words.map((word) => {
        return (
          <li
            className="h-16 min-w-16 bg-sand-1 rounded-xl font-medium text-2xl flex items-center px-4 w-fit"
            key={word.id}
          >
            {word.text}
          </li>
        );
      })}
    </ul>
  );
}
