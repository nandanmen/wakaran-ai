"use client";

import type { Game, RawRow } from "@/app/_lib/script";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";

export function LineLink({
  row,
  isCompleted = false,
}: {
  row: RawRow;
  isCompleted?: boolean;
}) {
  const params = useParams<{
    game: Game;
    script: string;
    rowNumber: string;
  }>();
  const active = row.row === Number(params.rowNumber);
  return (
    <Link
      className={clsx(
        "overflow-hidden pl-2.5 pr-1.5 h-10 flex items-center justify-between hover:bg-gray-3 rounded-md border",
        active
          ? "border-gray-6 bg-gray-1 dark:bg-gray-3 shadow-sm"
          : "text-gray-9 border-transparent",
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
      {isCompleted && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.53 7.15214C16.9983 7.44485 17.1407 8.0618 16.848 8.53013L11.848 16.5301C11.6865 16.7886 11.4159 16.9592 11.1132 16.9937C10.8104 17.0282 10.5084 16.9227 10.2929 16.7072L7.29289 13.7072C6.90237 13.3167 6.90237 12.6836 7.29289 12.293C7.68342 11.9025 8.31658 11.9025 8.70711 12.293L10.8182 14.4042L15.152 7.47013C15.4447 7.0018 16.0617 6.85943 16.53 7.15214Z"
            fill="currentColor"
          />
        </svg>
      )}
    </Link>
  );
}
