import { QuizController } from "./quiz-controller";
import { sql } from "../_lib/sql";
import type { Entry } from "../_lib/dictionary";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: { limit?: string };
}) {
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 30;
  const words = await sql<
    Entry[]
  >`select * from words order by random() limit ${limit}`;
  return (
    <div className="py-8 max-w-[600px] mx-auto">
      <QuizController words={words} />
    </div>
  );
}
