"use client";

import React, { FormEvent } from "react";
import { isKanji, toHiragana } from "wanakana";
import { useRouter } from "next/navigation";
import { Entry } from "../_lib/dictionary";

function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function QuizController({ words }: { words: Entry[] }) {
  const router = useRouter();
  const [questions, setQuestions] = React.useState<Entry[]>(words);
  const [index, setIndex] = React.useState(0);
  const currentWord = questions[index];
  return (
    <>
      <div
        className="h-2 bg-green-6 fixed top-0 w-screen left-0 origin-left transition-transform"
        style={{ transform: `scaleX(${index / questions.length})` }}
      />
      <Question
        key={index}
        word={currentWord}
        onSubmit={(word, isCorrect) => {
          if (!isCorrect) {
            setQuestions([...questions, word]);
          }
          if (index < questions.length - 1) {
            return setIndex(index + 1);
          }
          router.push("/words");
        }}
      />
    </>
  );
}

const getGrade = (form: HTMLFormElement, word: Entry) => {
  const data = new FormData(form);
  const responses = {
    meaning: data.get("meaning") as string,
    reading: data.get("reading") as string,
  };
  const hasKanji = [...word.text].some(isKanji);
  const isMeaningCorrect = word.meanings.includes(responses.meaning);
  const isReadingCorrect = hasKanji
    ? word.readings.includes(responses.reading)
    : true;
  return {
    reading: isReadingCorrect,
    meaning: isMeaningCorrect,
  };
};

export function Question({
  word,
  onSubmit,
}: {
  word: Entry;
  onSubmit: (word: Entry, isCorrect: boolean) => void;
}) {
  const [submitted, setSubmitted] = React.useState<{
    reading: boolean;
    meaning: boolean;
  } | null>(null);

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (submitted) {
      return onSubmit(word, submitted.reading && submitted.meaning);
    }
    setSubmitted(getGrade(e.target as HTMLFormElement, word));
  };

  return (
    <form className="flex flex-col px-8 space-y-4" onSubmit={next}>
      <p className="text-4xl text-center font-jp">{word.text}</p>
      <div className="space-y-4">
        <label className="flex flex-col gap-2 relative">
          <span className="text-sm text-gray-11">Meaning</span>
          <input
            className="bg-gray-2 border-b border-gray-7 py-2"
            type="text"
            name="meaning"
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
        <label className="flex flex-col gap-2 relative">
          <span className="text-sm text-gray-11">Reading</span>
          <HiraganaInput />
          {submitted && (
            <>
              <p className="flex justify-between items-center">
                <span>{word.readings.join(", ")}</span>
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

const CheckCircle = () => {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75V4.75C16.0041 4.75 19.25 7.99594 19.25 12V12C19.25 16.0041 16.0041 19.25 12 19.25V19.25C7.99594 19.25 4.75 16.0041 4.75 12V12Z"
      ></path>
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
      ></path>
    </svg>
  );
};

const CloseCircle = () => {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75V4.75C16.0041 4.75 19.25 7.99594 19.25 12V12C19.25 16.0041 16.0041 19.25 12 19.25V19.25C7.99594 19.25 4.75 16.0041 4.75 12V12Z"
      ></path>
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M9.75 9.75L14.25 14.25"
      ></path>
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M14.25 9.75L9.75 14.25"
      ></path>
    </svg>
  );
};
