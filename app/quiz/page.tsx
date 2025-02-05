import { QuizController } from "./quiz-controller";
import { sql } from "../_lib/sql";
import type { Entry } from "../_lib/dictionary";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string }>;
}) {
  const params = await searchParams;
  const limit = params.limit ? parseInt(params.limit) : 30;
  const words = await sql<
    Entry[]
  >`select * from words order by random() limit ${limit}`;
  return <QuizController words={words} />;
}
