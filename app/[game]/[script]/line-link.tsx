"use client";

import { Game, RawRow } from "@/app/_lib/script";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Speaker } from "./[rowNumber]/icons";

export function LineLink({ row }: { row: RawRow }) {
  const params = useParams<{
    game: Game;
    script: string;
    rowNumber: string;
  }>();
  const active = row.row === Number(params.rowNumber);
  return (
    <Link
      className={clsx(
        "overflow-hidden p-2 h-9 flex items-center hover:bg-gray-3 rounded-md border border-transparent",
        active ? "border-gray-6 bg-gray-1 shadow-sm" : "text-gray-9"
      )}
      href={`/${params.game}/${params.script}/${row.row}`}
      scroll={false}
    >
      <span className="text-sm flex gap-1 font-medium items-center">
        {row.jpnChrName ? (
          <span className="font-jp">{row.jpnChrName}</span>
        ) : (
          <span>{`<Blank>`}</span>
        )}
      </span>
    </Link>
  );
}
