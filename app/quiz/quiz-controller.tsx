"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { type FormEvent, useEffect, useRef, useState } from "react";
import { toHiragana } from "wanakana";
import type { Entry } from "../_lib/dictionary";
import { checkCorrect } from "./check-correct";
import { QuizSidebar } from "./sidebar";
import { Check, Close, CheckCircle, CloseCircle } from "../_components/icons";
import type { SavedWord } from "./types";

function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type Question = SavedWord & {
  correct?: boolean;
};

export function QuizController({ words }: { words: SavedWord[] }) {
  const router = useRouter();
  const [questions, setQuestions] = React.useState<Question[]>(words);
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = React.useState(0);
  const currentWord = questions[index];

  useEffect(() => {
    setExpanded(false);
  }, [index]);

  return (
    <div className="h-screen p-4 relative bg-gray-2">
      <div
        className={clsx(
          "grid h-full border border-gray-6 bg-gray-1 relative rounded-lg overflow-hidden transition-all duration-300",
          expanded
            ? "grid-cols-[200px_1fr_400px]"
            : "grid-cols-[200px_1fr_200px]",
        )}
      >
        <aside className="shrink-0 h-full flex flex-col">
          <header className="px-4 py-3 border-b border-gray-6 border-dashed">
            <h2 className="font-jp font-medium text-lg">分</h2>
          </header>
          <div className="relative grow">
            <div className="absolute left-0 right-0 top-1/2 h-[28px] bg-gray-3 translate-y-[-14px]">
              <div className="absolute left-full top-1/2 -translate-y-1/2 rotate-45 -translate-x-1/2 w-2.5 h-2.5 bg-gray-9" />
            </div>
            <div className="absolute left-0 right-0 top-1/2">
              <motion.ul
                className="flex flex-col justify-center text-lg"
                initial={{ y: -14 }}
                animate={{ y: -14 - index * 28 }}
              >
                {questions.map((w, i) => {
                  return (
                    <li
                      className={clsx(
                        "px-4 transition-colors duration-200 font-jp flex items-center justify-between",
                        i !== index && "text-gray-8",
                      )}
                      key={w.id}
                    >
                      {w.word}
                      {w.correct === undefined ? null : w.correct ? (
                        <Check />
                      ) : (
                        <Close />
                      )}
                    </li>
                  );
                })}
              </motion.ul>
            </div>
          </div>
        </aside>
        <Question
          word={currentWord}
          onNext={(word, isCorrect) => {
            setQuestions((q) => {
              const newQuestions = [...q];
              newQuestions[index] = {
                ...word,
                correct: isCorrect,
              };
              if (!isCorrect) {
                newQuestions.push({
                  ...word,
                  id: `${word.id}-${crypto.randomUUID()}`,
                });
              }
              return newQuestions;
            });
            setExpanded(false);
            if (index < questions.length - 1) {
              return setIndex(index + 1);
            }
            router.push("/words");
          }}
          onSubmit={(word, isCorrect) => {
            if (!isCorrect) {
              setExpanded(true);
            }
          }}
        />
      </div>
    </div>
  );
}

const getGrade = (form: HTMLFormElement, word: SavedWord) => {
  const data = new FormData(form);
  const responses = {
    meaning: (data.get("meaning") as string).toLowerCase().trim(),
    reading: (data.get("reading") as string).toLowerCase().trim(),
  };
  return checkCorrect(
    {
      text: word.word,
      readings: [
        word.metadata.reading.map((r) => r.reading ?? r.text).join(""),
      ],
      meanings: word.metadata.meanings.flatMap((m) => m.split(";")),
    },
    responses,
  );
};

export function Question({
  word,
  onNext,
  onSubmit,
}: {
  word: SavedWord;
  onSubmit: (word: SavedWord, isCorrect: boolean) => void;
  onNext: (word: SavedWord, isCorrect: boolean) => void;
}) {
  const [submitted, setSubmitted] = React.useState<{
    reading: boolean;
    meaning: boolean;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (submitted) {
      return onNext(word, submitted.reading && submitted.meaning);
    }
    const grade = getGrade(e.target as HTMLFormElement, word);
    setSubmitted(grade);
    onSubmit(word, grade.reading && grade.meaning);
  };

  useEffect(() => {
    setSubmitted(null);
    formRef.current?.reset();
    inputRef.current?.focus();
  }, [word]);

  return (
    <>
      <form
        className="h-full border-x border-gray-6 flex flex-col p-8"
        onSubmit={next}
        ref={formRef}
      >
        <div className="flex grow justify-center items-center">
          <p className="text-[56px] font-medium text-center font-jp">
            {word.word}
          </p>
        </div>
        <div className="space-y-4">
          <label className="flex flex-col gap-2 relative">
            <span className="text-sm text-gray-11">Meaning</span>
            <input
              className="bg-gray-2 border-b border-gray-7 py-2"
              type="text"
              name="meaning"
              ref={inputRef}
            />
            {submitted && (
              <>
                <p className="flex justify-between items-center">
                  <span>
                    {word.metadata.meanings
                      .flatMap((m) => m.split(";"))
                      .slice(0, 3)
                      .join(", ")}
                  </span>
                  {!submitted.meaning && (
                    <button
                      className="text-sm py-1 px-2 bg-gray-3 rounded-md"
                      type="button"
                      onClick={() =>
                        setSubmitted((s) => {
                          invariant(s !== null, "submitted should be defined");
                          return { ...s, meaning: true };
                        })
                      }
                    >
                      Is Correct
                    </button>
                  )}
                </p>
                <span className="absolute right-1 bottom-11">
                  {submitted.meaning ? <CheckCircle /> : <CloseCircle />}
                </span>
              </>
            )}
          </label>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: input is in the sub-component */}
          <label className="flex flex-col gap-2 relative">
            <span className="text-sm text-gray-11">Reading</span>
            <HiraganaInput key={word.word} />
            {submitted && (
              <>
                <p className="flex justify-between items-center">
                  <span className="font-jp">
                    {word.metadata.reading
                      .map((r) => r.reading ?? r.text)
                      .join("")}
                  </span>
                  {!submitted.reading && (
                    <button
                      className="text-sm py-1 px-2 bg-gray-3 rounded-md"
                      type="button"
                      onClick={() =>
                        setSubmitted((s) => {
                          invariant(s !== null, "submitted should be defined");
                          return { ...s, reading: true };
                        })
                      }
                    >
                      Is Correct
                    </button>
                  )}
                </p>
                <span className="absolute right-1 bottom-11">
                  {submitted.reading ? <CheckCircle /> : <CloseCircle />}
                </span>
              </>
            )}
          </label>
          {submitted && (
            <a
              className="underline"
              target="_blank"
              rel="noreferrer"
              href={`https://jisho.org/search/${word.text}`}
            >
              Jisho -{">"}
            </a>
          )}
        </div>
        <button type="submit" className="w-full bg-gray-3 rounded-lg py-2">
          {submitted ? "Next" : "Submit"}
        </button>
      </form>
      <QuizSidebar submitted={Boolean(submitted)} word={word.word} />
    </>
  );
}

function HiraganaInput() {
  const [value, setValue] = React.useState("");
  return (
    <input
      className="bg-gray-2 border-b border-gray-7 py-2 font-jp font-medium"
      type="text"
      name="reading"
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        if (next.endsWith("nn")) return setValue(`${value.slice(0, -1)}ん`);
        if (next.endsWith("y") && value.at(-1) === "n") {
          return setValue(next);
        }
        if (next.endsWith("n")) return setValue(next);
        setValue(toHiragana(next));
      }}
    />
  );
}
