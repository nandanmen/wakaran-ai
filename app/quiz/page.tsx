import type { Entry } from "../_lib/dictionary";
import { sql } from "../_lib/sql";
import { QuizController } from "./quiz-controller";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string }>;
}) {
  const params = await searchParams;
  const limit = params.limit ? Number.parseInt(params.limit) : 30;
  const words = await sql<
    Entry[]
  >`select * from words order by random() limit ${limit}`;
  return <QuizController words={words} />;
}
