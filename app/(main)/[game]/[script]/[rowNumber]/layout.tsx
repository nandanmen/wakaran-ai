import { getRow } from "@/app/_lib/script";
import { type ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import DesktopPage from "./_desktop/page";
import { RowText } from "./row-text";
import type { Params } from "./types";

export default async function RowLayout({
  params: p,
  children,
}: {
  params: Promise<Params>;
  children: ReactNode;
}) {
  const params = await p;
  return (
    <div className="h-full">
      <Toaster />
      <div className="block lg:hidden">
        <Suspense fallback={null}>
          <RowLoader params={params} />
        </Suspense>
      </div>
      <div className="hidden lg:block h-full">
        <DesktopPage params={params}>{children}</DesktopPage>
      </div>
    </div>
  );
}

async function RowLoader({ params }: { params: Params }) {
  const { game, script, rowNumber } = params;
  const data = await getRow({
    game,
    scriptId: script,
    rowNumber: Number(rowNumber),
  });
  if (!data) return <p>No translation found for row {rowNumber}</p>;
  const [nextRow, previousRow] = await Promise.all([
    getRow({ game, scriptId: script, rowNumber: Number(rowNumber) + 1 }),
    getRow({ game, scriptId: script, rowNumber: Number(rowNumber) - 1 }),
  ]);
  return <RowText row={data} nextRow={nextRow} previousRow={previousRow} />;
}
