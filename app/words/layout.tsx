import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { getSavedWords } from "../_lib/saved";

export const dynamic = "force-dynamic";

export default function WordsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen p-4 relative bg-gray-2 dark:bg-gray-1">
      <div className="grid divide-x divide-gray-6 h-full border border-gray-6 bg-gray-1 dark:bg-gray-2 relative rounded-lg overflow-hidden grid-cols-[200px_1fr]">
        <aside className="shrink-0 h-full flex flex-col overflow-hidden">
          <header className="px-4 py-3 flex justify-between items-center border-b border-gray-6 border-dashed bg-gray-1 dark:bg-gray-2">
            <h2 className="font-jp font-medium text-lg">分</h2>
            <Link className="text-sm" href="/quiz">
              Quiz -{">"}
            </Link>
          </header>
          <Suspense fallback={<p>Loading...</p>}>
            <WordsList />
          </Suspense>
        </aside>
        <main className="overflow-auto">{children}</main>
      </div>
    </div>
  );
}

async function WordsList() {
  const words = await getSavedWords();
  return (
    <ul className="overflow-y-auto h-full">
      {words.map((word) => {
        return (
          <li key={word.id}>
            <Link
              className="h-10 flex items-center px-4 font-jp"
              href={`/words/${word.id}`}
            >
              {word.word}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
