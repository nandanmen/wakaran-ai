import { getRow, type Game } from "@/app/_lib/script";
import { notFound } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { RowCard, RowCardPlaceholder } from "./row-card";
import { Params } from "../types";

export default async function DesktopPage({
  params: { game, script: scriptId, rowNumber },
  children,
}: {
  params: Params;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<RowCardPlaceholder />}>
      <Translation params={{ game, script: scriptId, rowNumber }}>
        {children}
      </Translation>
    </Suspense>
  );
}

async function Translation({
  params: { game, script: scriptId, rowNumber },
  children,
}: {
  params: Params;
  children: ReactNode;
}) {
  const row = await getRow({
    game,
    scriptId,
    rowNumber: Number(rowNumber),
  });
  if (!row) notFound();
  return <RowCard row={row}>{children}</RowCard>;
}
