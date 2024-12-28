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
    <div className="h-[calc(100vh-theme(space.12))] flex flex-col">
      <div className="grid grid-cols-[--grid] grow">
        <div className="col-start-2 p-4 h-full">
          <QuizController words={words} />
        </div>
      </div>
      <div className="h-12 border-t border-gray-6 border-dashed" />
    </div>
  );
}
