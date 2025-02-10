"use server";

import { markComplete } from "@/app/_lib/progress";
import { type Game, toGameId } from "@/app/_lib/script";

export async function markCompleteAction({
  game,
  scriptId,
  rowNumber,
}: {
  game: Game;
  scriptId: string;
  rowNumber: number;
}) {
  await markComplete({ gameId: toGameId(game), scriptId, rowNumber });
}
