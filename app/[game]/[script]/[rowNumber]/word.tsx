"use client";

import type { Word } from "@/app/_lib/translation";
import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import { AddCircle, Loader } from "./icons";
import { saveToDatabase } from "./actions";
import { useFormStatus } from "react-dom";

export function Word({ word }: { word: Word }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={clsx(open && "bg-sand-3 rounded-md")}>
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex justify-between items-center p-2 hover:bg-sand-3 rounded-md w-full"
        )}
      >
        <motion.p layout="position" className="font-medium">
          {word.word}
        </motion.p>
        <motion.p layout="position" className="text-xs text-sand-11">
          {word.meaning}
        </motion.p>
      </button>
      {open && (
        <form
          action={saveToDatabase}
          className="p-2 flex border-t border-sand-6 border-dashed gap-2"
        >
          <div className="grow">
            <input
              name="word"
              className="bg-sand-2 rounded h-10 px-2 w-full"
              type="text"
              defaultValue={word.dictionary || word.word}
            />
            <p className="text-xs text-sand-11 p-1 pb-0">
              This word should exist in Jisho and/or Wanikani.
            </p>
          </div>
          <SubmitButton />
        </form>
      )}
    </li>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className="w-10 h-10 text-sand-10 font-semibold rounded flex items-center justify-center hover:bg-sand-4"
      type="submit"
    >
      {pending ? (
        <span className="block animate-spin">
          <Loader size={24} />
        </span>
      ) : (
        <AddCircle size={24} />
      )}
    </button>
  );
};
