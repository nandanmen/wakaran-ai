import { Game, getScript, toGameId } from "@/app/_lib/script";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { LineLink } from "./line-link";
import Link from "next/link";

export default function ScriptLayout({
  params,
  children,
}: {
  params: {
    game: Game;
    script: string;
  };
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 bg-sand-2 dark:bg-sand-1 p-4">
      <div className="-mt-4">
        <header className="sticky top-0 py-4 bg-sand-2 dark:bg-sand-1">
          <h1 className="font-medium">
            <Link className="hover:underline" href={`/${params.game}`}>
              Trails in the Sky
            </Link>
          </h1>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <Lines game={params.game} scriptId={params.script} />
        </Suspense>
      </div>
      {children}
    </div>
  );
}

async function Lines({ game, scriptId }: { game: Game; scriptId: string }) {
  const script = await getScript({ gameId: toGameId(game), scriptId });
  if (!script) notFound();
  return (
    <ul className="divide-y divide-gray-6 divide-dashed">
      {script.map((row) => {
        return (
          <li className="first:-mt-4" key={row.row}>
            <LineLink row={row} />
          </li>
        );
      })}
    </ul>
  );
}
