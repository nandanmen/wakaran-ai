"use client";

import { Game, RawRow } from "@/app/_lib/script";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";

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
        "overflow-hidden block py-4",
        active ? "" : "text-gray-9"
      )}
      href={`/${params.game}/${params.script}/${row.row}`}
      scroll={false}
    >
      <span
        className={clsx(
          "text-sm flex gap-1",
          active ? "text-gray-11 mb-1" : ""
        )}
      >
        <span className="font-jp">{row.jpnChrName}</span>•
        <span>{row.engChrName}</span>
      </span>
      {active && (
        <span className="font-jp">
          {row.jpnSearchText.replaceAll("<br/>", "")}
        </span>
      )}
    </Link>
  );
}
