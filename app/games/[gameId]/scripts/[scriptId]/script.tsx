"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { useFormStatus } from "react-dom";

export type Word = {
  word: string;
  meaning: string;
  reading: string;
  type: string;
  form: string;
  dictionary: string;
};

export function Script({ script }: { script: any[] }) {
  return (
    <ul className="text-lg w-full max-w-[900px] shrink-0 overflow-hidden space-y-4">
      {script.map((row) => {
        return <Row key={row.row} row={row} />;
      })}
    </ul>
  );
}

function Row({ row }: { row: any }) {
  const params = useParams() as { gameId: string; scriptId: string };
  const searchParams = useSearchParams();
  const activeRowNumber = Number.parseInt(searchParams.get("row") ?? "");
  return (
    <li key={row.row}>
      <Link
        href={`/games/${params.gameId}/scripts/${params.scriptId}/${row.row}`}
        className={`p-4 space-y-2 block text-start bg-sand-1 rounded-xl border border-sand-4 w-full relative ${
          activeRowNumber === row.row ? "bg-gray-3" : ""
        }`}
      >
        <h2 className="font-medium">{row.jpnChrName}</h2>
        <p dangerouslySetInnerHTML={{ __html: row.jpnHtmlText }} />
      </Link>
      <div className="p-4 space-y-2 text-base text-sand-11 border border-sand-4 rounded-bl-xl rounded-br-xl -mt-2.5 pt-6">
        <h2 className="font-medium">{row.engChrName}</h2>
        <p>{row.engSearchText}</p>
      </div>
    </li>
  );
}

export function Edit({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div className="p-4">
        <button onClick={() => setOpen(!open)}>
          {open ? "Cancel" : "Edit"}
        </button>
      </div>
      {open && children}
    </>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const state = useFormStatus();
  return (
    <button className="w-fit flex gap-1">
      {children}
      {state.pending && (
        <span className="block animate-spin">
          <Spin />
        </span>
      )}
    </button>
  );
}

export function FavouriteButton({ favourited }: { favourited?: boolean }) {
  const state = useFormStatus();
  return (
    <button
      className="rounded-full text-gray-11 disabled:text-gray-8"
      disabled={favourited}
    >
      {state.pending ? (
        <span className="block animate-spin">
          <Spin />
        </span>
      ) : favourited ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5.75 12.8665L8.33995 16.4138C9.15171 17.5256 10.8179 17.504 11.6006 16.3715L18.25 6.75"
          ></path>
        </svg>
      ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 5.75V18.25"
          ></path>
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M18.25 12L5.75 12"
          ></path>
        </svg>
      )}
    </button>
  );
}

const Spin = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4.75V6.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M17.1266 6.87347L16.0659 7.93413"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M19.25 12L17.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M17.1266 17.1265L16.0659 16.0659"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M12 17.75V19.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M7.9342 16.0659L6.87354 17.1265"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M6.25 12L4.75 12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        d="M7.9342 7.93413L6.87354 6.87347"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};
