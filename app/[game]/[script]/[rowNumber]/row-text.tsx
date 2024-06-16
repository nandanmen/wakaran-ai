"use client";

import { Row } from "@/app/_lib/script";
import { useEffect, useState, useTransition } from "react";
import { clsx } from "clsx";
import { motion, useMotionValue, animate, useSpring } from "framer-motion";
import { Word } from "@/app/_lib/translation";
import { isKana } from "wanakana";
import { useParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
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
  const y = useSpring(0, {
    damping: 22,
    mass: 1,
    stiffness: 150,
  });

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
        const target = e.target as Element;
        if (target.closest("#translation")) return;
        e.preventDefault();
        const newX = x.get() + e.deltaX;
        x.set(newX);
        handleWheelEnd(newX);
      },
      { passive: false }
    );
  }, [x]);

  useEffect(() => {
    const currentRowNumber = Number(params.rowNumber);
    if (previousRow) {
      router.prefetch(
        `/${params.game}/${params.script}/${currentRowNumber - 1}`
      );
    }
    if (nextRow) {
      router.prefetch(
        `/${params.game}/${params.script}/${currentRowNumber + 1}`
      );
    }
  }, [params, previousRow, nextRow]);

  useEffect(() => {
    return document.addEventListener(
      "touchmove",
      (e) => {
        const target = e.target as Element;
        if (!target.closest("#translation")) e.preventDefault();
      },
      {
        passive: false,
      }
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
        "flex flex-col h-[100dvh] w-screen overflow-hidden transition-colors",
        open && "bg-sand-2 dark:bg-sand-1"
      )}
    >
      <header className="text-sand-11 flex p-8 justify-between items-center">
        <p className="font-jp">分</p>
        <div className="text-xs flex font-medium gap-3">
          <p>Trails in the Sky FC</p>
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
        onHeightMeasured={setHeight}
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
      <Furigana text={row.jp.text} translation={row.translation} open={open} />
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
  return slices.flatMap((slice) => {
    if (slice.type === "text") return slice;
    const { word, reading } = slice.value;
    if (isKana(word) || !reading || reading === word) {
      return {
        type: "text",
        value: word,
      };
    }
    return slice;
  });
}

function Furigana({
  text,
  translation,
  open = false,
}: {
  text: string;
  translation: Word[];
  open?: boolean;
}) {
  const slices = getSlices(text, translation);
  return (
    <p className="text-2xl flex flex-wrap items-end">
      {slices.map((slice, i) => {
        if (slice.type === "text") {
          return (
            <motion.span className="inline-block" layout="position" key={i}>
              {slice.value}
            </motion.span>
          );
        }
        const { word, reading } = slice.value;
        return (
          <motion.span layout="position" className="flex flex-col" key={i}>
            {open && (
              <motion.span
                animate={{ opacity: 1 }}
                className="text-sand-11 text-xs text-center"
              >
                {reading}
              </motion.span>
            )}
            <motion.span className="inline-block" layout="position">
              {word}
            </motion.span>
          </motion.span>
        );
      })}
    </p>
  );
}
