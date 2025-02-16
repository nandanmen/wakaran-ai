import { sql } from "../_lib/sql";
import { QuizController } from "./quiz-controller";
import type { SavedWord } from "./types";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string }>;
}) {
  const params = await searchParams;
  const limit = params.limit ? Number.parseInt(params.limit) : 30;
  const words = await sql<SavedWord[]>`
    select * from saved
    inner join dictionary on word_id = dictionary.id
    where user_id = 'nanda.s@hey.com'
    order by random()
    limit ${limit}
    `;
  return <QuizController words={words} />;
}
