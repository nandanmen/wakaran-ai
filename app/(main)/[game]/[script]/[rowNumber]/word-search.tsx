"use client";

import type { Entry } from "@/app/_lib/dictionary";
import Form from "next/form";
import { useId } from "react";
import { useFormStatus } from "react-dom";
import { saveToDatabase } from "./actions";
import { AddCircle, Loader } from "./icons";

export function WordSearch({
  word,
  entries,
}: {
  word: string;
  entries: Entry[];
}) {
  const id = useId();
  return (
    <div className="mt-2 border-t border-gray-6 px-2 py-4 border-dashed">
      <Form action="" className="text-sm flex items-center gap-1.5">
        <label htmlFor={id} className="text-gray-11 font-medium">
          Search:
        </label>
        <input
          id={id}
          className="bg-transparent w-full font-jp font-medium"
          type="text"
          name="word"
          defaultValue={word}
        />
      </Form>
      <ul className="mt-2">
        {entries?.map((entry) => (
          <li className="flex items-center justify-between" key={entry.id}>
            <div>
              <div className="font-jp flex items-center gap-1.5">
                <p className="font-medium">{entry.text}</p>
                <p className="text-gray-11 text-sm">
                  {entry.readings.slice(0, 3).join(", ")}
                </p>
              </div>
              <p className="text-sm text-gray-11 mt-1.5">
                {entry.meanings.slice(0, 2).join(", ")}
              </p>
            </div>
            <form action={saveToDatabase}>
              <input type="hidden" name="word" value={word} />
              <SubmitButton />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="h-10 w-10 flex items-center justify-end" type="submit">
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
