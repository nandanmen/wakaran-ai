"use client";

import React, { FormEvent } from "react";
import { toHiragana } from "wanakana";
import { useRouter } from "next/navigation";
import type { Word } from "../games/[gameId]/scripts/[scriptId]/script";

const QuizContext = React.createContext<{
  index: number;
  next: () => void;
} | null>(null);

export function QuizController({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [index, setIndex] = React.useState(0);
  const numChildren = React.Children.count(children);
  return (
    <QuizContext.Provider
      value={{
        index,
        next: () => {
          if (index < numChildren - 1) setIndex(index + 1);
          else router.push("/favourites");
        },
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function Question({ word, index }: { word: Word; index: number }) {
  const [submitted, setSubmitted] = React.useState(false);
  const ctx = React.useContext(QuizContext)!;
  if (!ctx) return null;
  if (ctx.index !== index) return null;

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (submitted) ctx.next();
    else setSubmitted(true);
  };

  return (
    <form className="flex flex-col px-8 space-y-4" onSubmit={next}>
      <p className="text-4xl text-center">{word.dictionary || word.word}</p>
      <div className="space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-11">Meaning</span>
          <input
            className="bg-gray-2 border-b border-gray-7 py-2"
            type="text"
            name="meaning"
          />
          {submitted && <p>{word.meaning}</p>}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-11">Reading</span>
          <HiraganaInput />
          {submitted && <p>{word.reading}</p>}
        </label>
        {submitted && (
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href={`https://jisho.org/search/${word.dictionary || word.word}`}
          >{`Jisho ->`}</a>
        )}
      </div>
      <button className="w-full bg-gray-3 rounded-lg py-2">
        {submitted ? "Next" : "Submit"}
      </button>
    </form>
  );
}

function HiraganaInput() {
  const [value, setValue] = React.useState("");
  return (
    <input
      className="bg-gray-2 border-b border-gray-7 py-2"
      type="text"
      name="reading"
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        if (next.endsWith("nn")) return setValue(`${value.slice(0, -1)}ん`);
        if (next.endsWith("n")) return setValue(next);
        setValue(toHiragana(next));
      }}
    />
  );
}
