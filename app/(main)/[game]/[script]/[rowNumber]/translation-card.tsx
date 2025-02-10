import type { Row } from "@/app/_lib/script";
import type { Word } from "@/app/_lib/translation";
import { clsx } from "clsx";
import { animate, motion, useMotionValue } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveToDatabase } from "./actions";
import { AddCircle, ChevronUp, Loader, Sparkles } from "./icons";
import { SPRING_CONFIG } from "./spring";

export function TranslationCard({
  open,
  pending,
  onOpenChange,
  onHeightMeasured,
  row,
}: {
  open: boolean;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onHeightMeasured: (height: number) => void;
  row: Row;
}) {
  const params = useParams<{
    game: string;
    script: string;
    rowNumber: string;
  }>();
  const [height, setHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  useEffect(() => {
    if (wrapperRef.current) {
      const measuredHeight = Math.round(
        wrapperRef.current.getBoundingClientRect().height,
      );
      setHeight(measuredHeight);
      y.set(measuredHeight - 65);
      onHeightMeasured(measuredHeight);
    }
  }, []);

  useEffect(() => {
    if (!height) return;
    if (open) {
      animate(y, 0, SPRING_CONFIG);
    } else {
      animate(y, height - 65, SPRING_CONFIG);
    }
  }, [open, height]);

  return (
    <>
      {!height && (
        <div
          className="bg-sand-1 rounded-tl-xl rounded-tr-xl py-3 max-h-[50svh] overflow-auto fixed bottom-0 w-screen"
          style={{
            border: "1px solid transparent",
            borderBottom: 0,
          }}
        >
          <p className="text-sand-11 text-xs justify-between flex items-center w-full px-8 py-3">
            <span className="flex items-center gap-1">
              <ChevronUp />
              <span className="font-medium">Translation</span>
            </span>
          </p>
        </div>
      )}
      <motion.div
        ref={wrapperRef}
        id="translation"
        className={clsx(
          "border border-b-0 bg-sand-1 rounded-tl-xl rounded-tr-xl py-3 max-h-[50svh] overflow-auto fixed bottom-0 w-screen",
          open ? "border-sand-6 dark:bg-sand-2" : "border-sand-1",
          height ? "opacity-100" : "opacity-0",
        )}
        style={{ y }}
      >
        <button
          className="text-sand-11 text-xs justify-between flex items-center w-full px-8 py-3"
          onClick={() => onOpenChange(!open)}
        >
          <span className="flex items-center gap-1">
            <span
              className={clsx(
                "block transition-transform",
                open && "rotate-180",
              )}
            >
              <ChevronUp />
            </span>
            <span className="font-medium">Translation</span>
          </span>
          {pending && (
            <span className="inline-block animate-spin">
              <Loader />
            </span>
          )}
        </button>
        <div className={clsx("text-sm px-8 overflow-hidden mt-2")}>
          <div className="space-y-1">
            <p className="text-sand-11">{row.en.name}</p>
            <p>{row.en.text}</p>
          </div>
          <ul className="-mx-2 mt-3">
            {row.translation
              ?.filter((word) => word.type !== "particle")
              .map((word) => {
                return (
                  <li key={word.word}>
                    <TranslationButton word={word} />
                  </li>
                );
              })}
          </ul>
          <button className="flex py-3 text-sand-11 justify-between w-full items-center mt-2">
            <span className="font-medium text-xs">Ask a question...</span>
            <Sparkles />
          </button>
        </div>
      </motion.div>
    </>
  );
}

function TranslationButton({ word }: { word: Word }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={clsx(open && "bg-sand-3 rounded-lg")}>
      <button
        className="flex items-center p-2 w-full hover:bg-sand-3 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <span className="font-jp">{word.word}</span>
        <span className="font-jp text-sand-11 ml-1">{word.reading}</span>
        <span className="ml-auto text-xs text-sand-11">{word.meaning}</span>
      </button>
      {open && (
        <form
          className="flex justify-between items-center p-2 pt-0 gap-2"
          action={saveToDatabase}
        >
          <input
            className="grow bg-sand-2 rounded py-1 px-2"
            type="text"
            name="word"
            defaultValue={word.word || word.dictionary}
          />
          <SubmitButton />
        </form>
      )}
    </div>
  );
}

function SubmitButton() {
  const state = useFormStatus();
  return (
    <button
      className="flex text-xs text-sand-11 font-medium gap-1"
      type="submit"
    >
      <span>Save</span>
      {state.pending ? (
        <span className="block animate-spin">
          <Loader />
        </span>
      ) : (
        <AddCircle />
      )}
    </button>
  );
}
