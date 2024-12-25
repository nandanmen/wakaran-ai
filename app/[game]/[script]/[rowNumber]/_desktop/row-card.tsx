"use client";

import type { Game, Row } from "@/app/_lib/script";
import { Furigana } from "../row-text";
import { ReactNode, useId, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Speaker } from "../icons";
import { atom, useAtom, useAtomValue } from "jotai";

export function RowCardPlaceholder() {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-4 h-full">
      <main className="flex items-center justify-center h-full relative bg-sand-1 dark:bg-sand-2 rounded-lg border border-sand-6 shadow-sm" />
    </div>
  );
}

const settingsAtom = atom({
  open: false,
  translation: false,
});

function Settings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  return (
    <div className="flex items-center gap-2 text-sm">
      <Switch
        label="Furigana"
        checked={settings.open}
        onChange={(c) => setSettings({ ...settings, open: c })}
      />
      <Switch
        label="Translation"
        checked={settings.translation}
        onChange={(c) => setSettings({ ...settings, translation: c })}
      />
    </div>
  );
}

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      className="flex items-center gap-2"
      onClick={() => onChange(!checked)}
    >
      <span className="text-gray-11 font-medium">{label}</span>
      <span className="p-[2px] h-fit inline-flex border border-gray-6 rounded-full">
        <span
          className={clsx(
            "w-6 inline-flex bg-gray-1 rounded-full transition-colors",
            checked ? "bg-gray-8" : "bg-gray-1"
          )}
        >
          <span
            className="w-2.5 h-2.5 rounded-full bg-gray-12 transition-transform"
            style={{
              transform: checked ? "translateX(14px)" : "translateX(0)",
            }}
          />
        </span>
      </span>
    </button>
  );
}

export function RowCard({ row, children }: { row: Row; children: ReactNode }) {
  const params = useParams<{
    game: Game;
    script: string;
    rowNumber: string;
  }>();
  const pathname = usePathname();
  const last = pathname.split("/").at(-1);
  const active = last === params.rowNumber ? "words" : last;

  const { open, translation } = useAtomValue(settingsAtom);

  return (
    <div className="h-full grid grid-cols-[1fr_300px] gap-4">
      <main className="flex items-center justify-center h-full relative bg-sand-1 dark:bg-sand-2 rounded-lg border border-sand-6 shadow-sm">
        <div className="max-w-[600px] space-y-2">
          <motion.p layout="position" className="font-jp text-lg">
            {row.jp.name}
          </motion.p>
          <Furigana
            className="text-2xl font-medium font-jp leading-normal"
            text={row.jp.text.trim()}
            translation={row.translation}
            open={open}
          />
          <motion.div
            style={{ x: "-50%" }}
            initial={{
              y: 0,
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={
              translation
                ? {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                  }
                : {
                    y: 16,
                    opacity: 0,
                    filter: "blur(10px)",
                  }
            }
            transition={{ y: { type: "spring", bounce: 0 } }}
            className="absolute bottom-6 w-full max-w-[600px] text-sand-11 left-1/2 text-sm space-y-2"
          >
            <p>{row.en.name}</p>
            <p>{row.en.text}</p>
          </motion.div>
        </div>
        {row.audio && <AudioButton audio={row.audio} />}
        <div className="absolute top-4 right-4 flex items-center gap-2 text-sm">
          <Settings />
        </div>
      </main>
      <aside className="h-full overflow-y-auto flex flex-col">
        <header className="sticky top-0 bg-sand-2">
          <h2 className="text-sm font-medium text-gray-11 capitalize px-2">
            {active}
          </h2>
        </header>
        {children}
      </aside>
    </div>
  );
}

function AudioButton({ audio }: { audio: string[] }) {
  const id = useId();

  const playIndex = (index: number) => {
    const el = document.getElementById(`${id}-${index}`) as HTMLAudioElement;
    el?.play();
  };

  return (
    <div className="absolute top-4 left-4">
      {audio.map((href, index) => {
        return (
          <audio
            id={`${id}-${index}`}
            key={href}
            onEnded={() =>
              setTimeout(() => {
                playIndex(index + 1);
              }, 500)
            }
          >
            <source src={href} type="audio/ogg" />
          </audio>
        );
      })}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-sand-1 text-sand-10"
        onClick={() => playIndex(0)}
      >
        <Speaker size={20} />
      </button>
    </div>
  );
}

function ButtonTab({
  onClick,
  href,
  active,
  children,
}: {
  onClick?: () => void;
  href?: string;
  active?: boolean;
  children?: ReactNode;
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center justify-center w-8 h-8 rounded-md first:rounded-t-[20px] last:rounded-b-[20px]",
          active ? "bg-green-10 text-sand-1" : "hover:bg-sand-4 text-sand-11"
        )}
        scroll={false}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center w-8 h-8 rounded-md first:rounded-t-[20px] last:rounded-b-[20px]",
        active ? "bg-green-10 text-sand-1" : "hover:bg-sand-4 text-sand-11"
      )}
    >
      {children}
    </button>
  );
}
