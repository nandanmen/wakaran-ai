import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { getSavedWords } from "../_lib/saved";
import { BackgroundDots } from "../_components/background-dots";
import { WordList } from "./word-list";

export const dynamic = "force-dynamic";

export default function WordsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-screen p-4 pt-2 relative bg-gray-2 dark:bg-gray-1 flex flex-col">
      <header className="flex items-center -mb-px px-4">
        <h1 className="font-jp font-medium text-gray-11 text-lg -translate-y-1">
          分
        </h1>
        <Link
          className="text-sm font-medium ml-auto mr-2 h-10 bg-gray-1 dark:bg-gray-2 flex items-center px-2.5 rounded-t-lg border-gray-6 border border-b-gray-1 relative z-10 dark:border-b-gray-2"
          href="/words"
        >
          <span className="flex translate-y-px">Words</span>
          <svg
            aria-hidden="true"
            className="absolute right-full -bottom-px"
            width="8"
            viewBox="0 0 8 8"
          >
            <path d="M0 8 A 8 8 0 0 0 8 0V8 H0 Z" className="fill-gray-1" />
            <path d="M0 8 H 8" className="stroke-gray-1" />
            <path
              d="M0 8 A 8 8 0 0 0 8 0"
              className="stroke-gray-6"
              fill="none"
            />
          </svg>
          <svg
            aria-hidden="true"
            className="absolute left-full -bottom-px -scale-x-100"
            width="8"
            viewBox="0 0 8 8"
          >
            <path d="M0 8 A 8 8 0 0 0 8 0V8 H0 Z" className="fill-gray-1" />
            <path d="M0 8 H 8" className="stroke-gray-1" />
            <path
              d="M0 8 A 8 8 0 0 0 8 0"
              className="stroke-gray-6"
              fill="none"
            />
          </svg>
        </Link>
        <Link
          className="text-sm font-medium h-10 flex items-center px-[5px] rounded-t-lg border-transparent border"
          href="/quiz"
        >
          <span className="flex translate-y-px">Quiz</span>
        </Link>
      </header>
      <div className="grid divide-x divide-gray-6 h-full border border-gray-6 bg-gray-1 dark:bg-gray-2 relative rounded-lg overflow-hidden grid-cols-[200px_1fr]">
        <aside className="shrink-0 h-full flex flex-col overflow-hidden">
          <h2 className="p-4 pb-2 text-sm font-medium text-gray-11">
            Saved Words
          </h2>
          <Suspense
            fallback={
              <div className="p-4 grow relative text-gray-6">
                <BackgroundDots />
              </div>
            }
          >
            <WordListLoader />
          </Suspense>
        </aside>
        <main className="overflow-auto">{children}</main>
      </div>
    </div>
  );
}

async function WordListLoader() {
  const words = await getSavedWords();
  return <WordList words={words} />;
}
