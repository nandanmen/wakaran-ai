"use client";

import { useEffect, useRef, useState } from "react";
import debounce from "debounce";
import Markdown from "react-markdown";
import { Spinner } from "@/app/_components/icons";
import clsx from "clsx";

export function Notes({
  initialValue,
  onSave,
}: { initialValue: string; onSave?: (value: string) => Promise<void> }) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      textRef.current?.focus();
    }
  }, [editing]);

  const save = async () => {
    if (!onSave) return;
    setSaving(true);
    await onSave(currentValue);
    setSaving(false);
  };
  const debouncedSave = debounce(save, 4000);

  return (
    <>
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-medium mb-2">Notes</h3>
        <p
          className={clsx(
            "flex items-center text-sm text-gray-10 transition-opacity duration-300",
            saving ? "opacity-1" : "opacity-0",
          )}
        >
          <span>Saving...</span>
          <span className="inline-block animate-spin">
            <Spinner size={20} />
          </span>
        </p>
      </header>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div className="grow" onClick={() => setEditing(!editing)}>
        {editing ? (
          <textarea
            ref={textRef}
            name="comment"
            className="bg-transparent h-full w-full text-sm focus:outline-none placeholder:text-gray-10 leading-relaxed"
            value={currentValue}
            onChange={(e) => {
              setCurrentValue(e.target.value);
            }}
            onBlur={() => {
              save();
              setEditing(false);
            }}
          />
        ) : currentValue ? (
          <div className="[&_ul]:list-disc [&_ul]:pl-4">
            <Markdown>{currentValue}</Markdown>
          </div>
        ) : (
          <p className="text-gray-10 text-sm">
            Note something down about this word...
          </p>
        )}
      </div>
    </>
  );
}
