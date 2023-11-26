import { kv } from "@vercel/kv";
import type { Word } from "../games/[gameId]/scripts/[scriptId]/script";
import { QuizController } from "./quiz-controller";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const keys = await kv.keys("nanda:favourites:*");
  const shuffledWords = shuffle(keys);
  const words = await Promise.all(keys.map((key) => kv.get<Word>(key)));
  return (
    <div className="py-8 max-w-[600px] mx-auto">
      <QuizController words={words as Word[]} />
    </div>
  );
}

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
