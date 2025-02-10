"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, {
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { toHiragana } from "wanakana";
import type { Entry } from "../_lib/dictionary";
import { checkCorrect } from "./check-correct";
import { QuizSidebar } from "./sidebar";

function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export type WordsWithKanjis = Entry & { kanjis?: Record<string, string> };

type Question = WordsWithKanjis & {
  correct?: boolean;
};

export function StripePattern({
  size = 8,
  ...props
}: {
  size?: number;
} & React.ComponentPropsWithoutRef<"pattern">) {
  return (
    <defs>
      <pattern
        viewBox="0 0 10 10"
        width={size}
        height={size}
        patternUnits="userSpaceOnUse"
        {...props}
      >
        <line
          x1="0"
          y1="10"
          x2="10"
          y2="0"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </pattern>
    </defs>
  );
}

function BackgroundStripes({
  patternProps,
}: {
  patternProps?: React.ComponentPropsWithoutRef<"pattern">;
}) {
  const id = useId();
  return (
    <svg aria-hidden="true" width="100%" height="100%">
      <StripePattern id={id} {...patternProps} />
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function QuizController({ words }: { words: WordsWithKanjis[] }) {
  const router = useRouter();
  const [questions, setQuestions] = React.useState<Question[]>(words);
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = React.useState(0);
  const currentWord = questions[index];

  useEffect(() => {
    setExpanded(false);
  }, [index]);

  return (
    <div className="h-screen p-4 relative">
      <div className="absolute inset-0 text-gray-3">
        <BackgroundStripes />
      </div>
      <div
        className={clsx(
          "grid h-full border border-gray-6 bg-gray-2 relative rounded-lg overflow-hidden transition-all duration-300",
          expanded
            ? "grid-cols-[200px_1fr_400px]"
            : "grid-cols-[200px_1fr_200px]",
        )}
      >
        <aside className="shrink-0 h-full relative">
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
                      "px-8 transition-colors duration-200 font-jp flex items-center justify-between",
                      i !== index && "text-gray-8",
                    )}
                    key={w.id}
                  >
                    {w.text}
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

const getGrade = (form: HTMLFormElement, word: Entry) => {
  const data = new FormData(form);
  const responses = {
    meaning: (data.get("meaning") as string).toLowerCase().trim(),
    reading: (data.get("reading") as string).toLowerCase().trim(),
  };
  return checkCorrect(word, responses);
};

export function Question({
  word,
  onNext,
  onSubmit,
}: {
  word: WordsWithKanjis;
  onSubmit: (word: WordsWithKanjis, isCorrect: boolean) => void;
  onNext: (word: WordsWithKanjis, isCorrect: boolean) => void;
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
            {word.text}
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
                  <span>{word.meanings.join(", ")}</span>
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
            <HiraganaInput key={word.text} />
            {submitted && (
              <>
                <p className="flex justify-between items-center">
                  <span className="font-jp">{word.readings.join(", ")}</span>
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
            >Jisho -{'>'}</a>
          )}
        </div>
        <button type="submit" className="w-full bg-gray-3 rounded-lg py-2">
          {submitted ? "Next" : "Submit"}
        </button>
      </form>
      <QuizSidebar submitted={Boolean(submitted)} word={word.text} />
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

const Check = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Check"
      role="img"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.53 7.15214C16.9983 7.44485 17.1407 8.0618 16.848 8.53013L11.848 16.5301C11.6865 16.7886 11.4159 16.9592 11.1132 16.9937C10.8104 17.0282 10.5084 16.9227 10.2929 16.7072L7.29289 13.7072C6.90237 13.3167 6.90237 12.6836 7.29289 12.293C7.68342 11.9025 8.31658 11.9025 8.70711 12.293L10.8182 14.4042L15.152 7.47013C15.4447 7.0018 16.0617 6.85943 16.53 7.15214Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Close = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Close"
	  			role="img"
    >
      <path
        d="M8 8L16 16M16 8L8 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CheckCircle = () => {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Check" role="img">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75V4.75C16.0041 4.75 19.25 7.99594 19.25 12V12C19.25 16.0041 16.0041 19.25 12 19.25V19.25C7.99594 19.25 4.75 16.0041 4.75 12V12Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
      />
    </svg>
  );
};

const CloseCircle = () => {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Close" role="img">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75V4.75C16.0041 4.75 19.25 7.99594 19.25 12V12C19.25 16.0041 16.0041 19.25 12 19.25V19.25C7.99594 19.25 4.75 16.0041 4.75 12V12Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 9.75L14.25 14.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.25 9.75L9.75 14.25"
      />
    </svg>
  );
};
