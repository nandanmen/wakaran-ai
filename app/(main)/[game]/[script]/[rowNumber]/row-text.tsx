"use client";

import type { Row } from "@/app/_lib/script";
import type { Word } from "@/app/_lib/translation";
import { clsx } from "clsx";
import { animate, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { isKana } from "wanakana";
import { Tooltip } from "./_desktop/tooltip";
import { SPRING_CONFIG } from "./spring";
import { TranslationCard } from "./translation-card";

export function RowText({
  row,
  nextRow,
  previousRow,
}: {
  row: Row;
  nextRow?: Row;
  previousRow?: Row;
}) {
  const params = useParams<{
    game: string;
    script: string;
    rowNumber: string;
  }>();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const y = useSpring(0, SPRING_CONFIG);

  const handleGestureEnd = (offset: number) => {
    const windowWidth = window.innerWidth;
    const currentRowNumber = Number(params.rowNumber);
    if (Math.abs(offset) > windowWidth / 2) {
      if (offset > 0 && previousRow) {
        animate(x, windowWidth, {
          type: "spring",
          duration: 0.5,
        }).then(() => {
          push(currentRowNumber - 1);
        });
        return;
      } else if (offset < 0 && nextRow) {
        animate(x, -windowWidth, {
          type: "spring",
          duration: 0.5,
        }).then(() => {
          push(currentRowNumber + 1);
        });
        return;
      }
    }
    animate(x, 0, {
      type: "spring",
      duration: 0.5,
    });
  };

  const x = useMotionValue(0);
  const handleWheelEnd = useDebouncedCallback(handleGestureEnd, 100);

  useEffect(() => {
    document.addEventListener(
      "wheel",
      (e) => {
        if (window.innerWidth > 1000) return;
        const target = e.target as Element;
        if (target.closest("#translation")) return;
        e.preventDefault();
        const newX = x.get() + e.deltaX;
        x.set(newX);
        handleWheelEnd(newX);
      },
      { passive: false },
    );
  }, [x]);

  useEffect(() => {
    const currentRowNumber = Number(params.rowNumber);
    if (previousRow) {
      router.prefetch(
        `/${params.game}/${params.script}/${currentRowNumber - 1}`,
      );
    }
    if (nextRow) {
      router.prefetch(
        `/${params.game}/${params.script}/${currentRowNumber + 1}`,
      );
    }
  }, [params, previousRow, nextRow]);

  useEffect(() => {
    return document.addEventListener(
      "touchmove",
      (e) => {
        if (window.innerWidth > 1000) return;
        const target = e.target as Element;
        if (!target.closest("#translation")) e.preventDefault();
      },
      {
        passive: false,
      },
    );
  }, []);

  const push = (rowNumber: number) => {
    startTransition(() => {
      router.push(`/${params.game}/${params.script}/${rowNumber}`);
    });
  };

  return (
    <div
      className={clsx(
        "flex flex-col h-[100svh] w-screen overflow-hidden transition-colors",
        open && "bg-sand-2 dark:bg-sand-1",
      )}
    >
      <header className="text-sand-11 flex p-8 justify-between items-center">
        <p className="font-jp">
          <Link href="/words">分</Link>
        </p>
        <div className="text-xs flex font-medium gap-3">
          <p>
            <Link href="/sky">Trails in the Sky FC</Link>
          </p>
          <p
            style={{
              fontFeatureSettings: "'ss09' 1",
            }}
          >
            001
          </p>
        </div>
      </header>
      <main className="font-jp grow mb-16">
        <motion.div
          className="h-full"
          drag="x"
          dragMomentum={false}
          style={{ x, y }}
          onPanEnd={(_, info) => {
            handleGestureEnd(info.offset.x);
          }}
        >
          <div className="h-full w-[300vw] grid grid-cols-3 gap-16 px-8 -translate-x-[100vw]">
            {previousRow && <RowSentence row={previousRow} />}
            <RowSentence row={row} open={open} />
            {nextRow && <RowSentence row={nextRow} />}
          </div>
        </motion.div>
      </main>
      <TranslationCard
        row={row}
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (open) {
            y.set(-height / 2);
          } else {
            y.set(0);
          }
        }}
        onHeightMeasured={(h) => {
          setHeight(h);
        }}
        pending={pending}
      />
    </div>
  );
}

function RowSentence({ row, open }: { row: Row; open?: boolean }) {
  return (
    <div className="flex flex-col gap-1 justify-center h-full">
      <motion.p layout="position" className="text-sand-11">
        {row.jp.name}
      </motion.p>
      <Furigana
        className="text-2xl"
        text={row.jp.text}
        translation={row.translation}
        open={open}
      />
    </div>
  );
}

function getSlices(text: string, translation: Word[]) {
  const slices: Array<any> = [];
  let start = 0;
  for (const word of translation) {
    const pos = text.indexOf(word.word, start);
    if (pos === -1) continue;
    const before = text.slice(start, pos);
    if (before.length) {
      slices.push({ type: "text", value: before });
    }
    slices.push({ type: "word", value: word });
    start = pos + word.word.length;
  }
  const remainder = text.slice(start);
  if (remainder.length) {
    slices.push({ type: "text", value: text.slice(start) });
  }
  return slices;
}

export function Furigana({
  className,
  text,
  translation,
  open = false,
}: {
  className?: string;
  text: string;
  translation: Word[];
  open?: boolean;
}) {
  if (!translation || !Array.isArray(translation)) return null;
  const slices = getSlices(text, translation);
  return (
    <p className={clsx("flex flex-wrap items-end", className)}>
      {slices.map((slice, i) => {
        if (slice.type === "text") {
          return (
            <motion.span className="inline-block" layout="position" key={i}>
              {slice.value}
            </motion.span>
          );
        }
        const { word, reading } = slice.value;
        const kanaOnly = isKana(word) || reading === word;
        return (
          <motion.span layout="position" className="flex flex-col" key={i}>
            {open && !kanaOnly && (
              <motion.span
                animate={{ opacity: 1 }}
                className="text-sand-11 text-xs text-center"
              >
                {reading}
              </motion.span>
            )}
            <Tooltip
              content={
                <span className="flex flex-col items-center gap-1">
                  {slice.value.reading && (
                    <span className="font-jp font-medium">
                      {slice.value.reading}
                    </span>
                  )}
                  <span>{slice.value.meaning}</span>
                </span>
              }
            >
              <motion.span
                className="inline-block hover:bg-green-4 rounded-md"
                layout="position"
              >
                {word}
              </motion.span>
            </Tooltip>
          </motion.span>
        );
      })}
    </p>
  );
}
