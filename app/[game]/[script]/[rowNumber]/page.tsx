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
  const [nextRow, previousRow] = await Promise.all([
    getRow({ game, scriptId: script, rowNumber: Number(rowNumber) + 1 }),
    getRow({ game, scriptId: script, rowNumber: Number(rowNumber) - 1 }),
  ]);
  return <RowText row={data} nextRow={nextRow} previousRow={previousRow} />;
}
