import { getProgress } from "@/app/_lib/progress";
import { type Game, getScript, toGameId } from "@/app/_lib/script";
import type { ReactNode } from "react";
import { LineLink } from "./[rowNumber]/_desktop/line-link";
import { Sidebar } from "./[rowNumber]/_desktop/sidebar";
import type { Params } from "./[rowNumber]/types";

export default function ScriptLayout({
  params,
  children,
}: {
  params: Params;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[--grid] h-full">
      <aside className="h-full overflow-y-auto">
        <Lines game={params.game} scriptId={params.script} />
      </aside>
      <div className="h-full">{children}</div>
      <aside className="p-4">
        <Sidebar />
      </aside>
    </div>
  );
}

async function Lines({ game, scriptId }: { game: Game; scriptId: string }) {
  const gameId = toGameId(game);
  const script = await getScript({ gameId, scriptId });
  if (!script) return null;

  const progress = await getProgress({ gameId, scriptId });
  return (
    <ul className="p-4">
      {script.map((row) => {
        return (
          <li key={row.row}>
            <LineLink row={row} isCompleted={progress.includes(row.row)} />
          </li>
        );
      })}
    </ul>
  );
}
