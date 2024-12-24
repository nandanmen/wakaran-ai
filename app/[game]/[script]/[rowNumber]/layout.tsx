import { Game, getRow } from "@/app/_lib/script";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { RowText } from "./row-text";
import DesktopPage from "./_desktop/page";
import { ReactNode, Suspense } from "react";
import { Params } from "./types";

export default async function RowLayout({
  params,
  children,
}: {
  params: Params;
  children: ReactNode;
}) {
  return (
    <>
      <Toaster />
      <div className="block lg:hidden">
        <Suspense fallback={null}>
          <RowLoader params={params} />
        </Suspense>
      </div>
      <div className="hidden lg:block h-full">
        <DesktopPage params={params}>{children}</DesktopPage>
      </div>
    </>
  );
}

async function RowLoader({ params }: { params: Params }) {
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
