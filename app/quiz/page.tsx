import { kv } from "@vercel/kv";
import type { Word } from "../games/[gameId]/scripts/[scriptId]/script";
import { Question, QuizController } from "./quiz-controller";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const words = await kv.keys("nanda:favourites:*");
  const shuffledWords = shuffle(words);
  return (
    <div className="py-8">
      <QuizController>
        {shuffledWords.map((word, index) => (
          <Suspense key={word} fallback={null}>
            <QuestionWrapper index={index} keyName={word} />
          </Suspense>
        ))}
      </QuizController>
    </div>
  );
}

async function QuestionWrapper({
  keyName,
  index,
}: {
  keyName: string;
  index: number;
}) {
  const word = await kv.get<Word>(keyName);
  if (!word) return null;
  return <Question word={word} index={index} />;
}

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
