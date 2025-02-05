import { getRow } from "@/app/_lib/script";
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
  if (!row)
    return (
      <div className="h-full flex items-center justify-center text-gray-11">
        <p>No translation found for row {rowNumber}.</p>
      </div>
    );
  return <RowCard row={row}>{children}</RowCard>;
}
