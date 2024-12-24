import { Game, getAudioFromRow, getScript, toGameId } from "@/app/_lib/script";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { LineLink } from "./line-link";
import { Sidebar } from "./sidebar";

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
    <div className="grid grid-cols-[150px_1fr_max-content]">
      <div className="col-start-1 row-start-1 col-span-3 border-b border-dashed border-gray-6" />
      <nav className="col-start-2 row-start-1 h-12 flex items-center px-4">
        <h1 className="text-sm font-medium text-gray11">Trails in the Sky</h1>
      </nav>
      <div className="col-start-1 row-start-1 row-span-2 border-r border-dashed border-gray-6" />
      <div className="col-start-3 row-start-1 row-span-2 border-l border-dashed border-gray-6" />
      <aside className="col-start-1 row-start-2 h-[calc(100vh-theme(space.12))] overflow-y-auto">
        <Suspense>
          <Lines game={params.game} scriptId={params.script} />
        </Suspense>
      </aside>
      <main className="col-start-2 row-start-2 h-[calc(100vh-theme(space.12))]  overflow-y-auto p-4">
        {children}
      </main>
      <aside className="col-start-3 row-start-2 p-4">
        <Sidebar />
      </aside>
    </div>
  );
}

async function Lines({ game, scriptId }: { game: Game; scriptId: string }) {
  const script = await getScript({ gameId: toGameId(game), scriptId });
  if (!script) notFound();
  return (
    <ul className="p-4">
      {script.map((row) => {
        return (
          <li key={row.row}>
            <LineLink row={row} />
          </li>
        );
      })}
    </ul>
  );
}
