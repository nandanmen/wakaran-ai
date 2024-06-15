import { Game, getRow } from "@/app/_lib/script";
import { notFound } from "next/navigation";
import { RowText } from "./row-text";

export default async function RowPage({
  params,
}: {
  params: {
    game: Game;
    script: string;
    rowNumber: string;
  };
}) {
  const { game, script, rowNumber } = params;
  const data = await getRow({
    game,
    scriptId: script,
    rowNumber: Number(rowNumber),
  });
  if (!data) notFound();
  return <RowText row={data} />;
}
