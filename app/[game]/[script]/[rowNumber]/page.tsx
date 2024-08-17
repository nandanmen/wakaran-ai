import { Game, getRow } from "@/app/_lib/script";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { RowText } from "./row-text";
import DesktopPage from "./_desktop/page";

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
  return (
    <>
      <Toaster />
      <div className="block lg:hidden">
        <RowText row={data} nextRow={nextRow} previousRow={previousRow} />
      </div>
      <div className="hidden lg:block">
        <DesktopPage params={params} />
      </div>
    </>
  );
}
