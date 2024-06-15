"use client";

import { Row } from "@/app/_lib/script";
import { useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Word } from "@/app/_lib/translation";
import { isKana } from "wanakana";

export function RowText({ row }: { row: Row }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={clsx(
        "flex flex-col h-screen transition-colors",
        open && "bg-sand-2"
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
      <main className="font-jp flex flex-col gap-1 justify-center grow px-8">
        <motion.p layout="position" className="text-sand-11">
          {row.jp.name}
        </motion.p>
        <Furigana
          text={row.jp.text}
          translation={row.translation}
          open={open}
        />
      </main>
      <div
        className={clsx(
          "border border-b-0 bg-sand-1 rounded-tl-xl rounded-tr-xl py-3",
          open ? "border-sand-6" : "border-sand-1"
        )}
      >
        <button
          className="text-sand-11 text-xs justify-between flex items-center w-full px-8 py-3"
          onClick={() => setOpen(!open)}
        >
          <span className="flex items-center gap-1">
            <span
              className={clsx(
                "block transition-transform",
                open && "rotate-180"
              )}
            >
              <ChevronUp />
            </span>
            <span className="font-medium">Translation</span>
          </span>
          <Gear />
        </button>
        {open && (
          <div className="text-sm px-8 mt-2">
            <div className="space-y-1">
              <p className="text-sand-11">{row.en.name}</p>
              <p>{row.en.text}</p>
            </div>
            <ul className="-mx-2 mt-3">
              {row.translation
                .filter((word) => word.type !== "particle")
                .map((word) => {
                  return (
                    <li key={word.word}>
                      <button className="flex items-center p-2 w-full">
                        <span className="font-jp">{word.word}</span>
                        <span className="font-jp text-sand-11 ml-1">
                          {word.reading}
                        </span>
                        <span className="text-sand-11 ml-auto flex gap-2">
                          <span className="ml-auto text-xs">
                            {word.meaning}
                          </span>
                          <AddCircle />
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
            <button className="flex py-3 text-sand-11 justify-between w-full items-center mt-2">
              <span className="font-medium text-xs">Ask a question...</span>
              <Sparkles />
            </button>
          </div>
        )}
      </div>
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
    <p className="text-2xl">
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
          <motion.ruby layout="position" className="inline-block" key={i}>
            {open && (
              <motion.rt animate={{ opacity: 1 }} className="text-sand-11">
                {reading}
              </motion.rt>
            )}
            <motion.span className="inline-block" layout="position">
              {word}
            </motion.span>
          </motion.ruby>
        );
      })}
    </p>
  );
}

// ---

function Sparkles() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16665 5.16666C9.16665 4.89052 8.94278 4.66666 8.66665 4.66666C8.39051 4.66666 8.16665 4.89052 8.16665 5.16666C8.16665 6.78386 7.80938 7.83419 7.15511 8.48846C6.50083 9.14272 5.45052 9.49999 3.83331 9.49999C3.55717 9.49999 3.33331 9.72386 3.33331 9.99999C3.33331 10.2761 3.55717 10.5 3.83331 10.5C5.45052 10.5 6.50083 10.8573 7.15511 11.5115C7.80938 12.1658 8.16665 13.2161 8.16665 14.8333C8.16665 15.1095 8.39051 15.3333 8.66665 15.3333C8.94278 15.3333 9.16665 15.1095 9.16665 14.8333C9.16665 13.2161 9.52391 12.1658 10.1782 11.5115C10.8324 10.8573 11.8828 10.5 13.5 10.5C13.7761 10.5 14 10.2761 14 9.99999C14 9.72386 13.7761 9.49999 13.5 9.49999C11.8828 9.49999 10.8324 9.14272 10.1782 8.48846C9.52391 7.83419 9.16665 6.78386 9.16665 5.16666Z"
        fill="#63635E"
      />
      <path
        d="M3.99998 3.66668C3.99998 3.48258 3.85074 3.33334 3.66665 3.33334C3.48255 3.33334 3.33331 3.48258 3.33331 3.66668C3.33331 4.32043 3.18851 4.71508 2.95178 4.95181C2.71505 5.18854 2.3204 5.33334 1.66665 5.33334C1.48255 5.33334 1.33331 5.48258 1.33331 5.66668C1.33331 5.85077 1.48255 6.00001 1.66665 6.00001C2.3204 6.00001 2.71505 6.14482 2.95178 6.38154C3.18851 6.61828 3.33331 7.01294 3.33331 7.66668C3.33331 7.85074 3.48255 8.00001 3.66665 8.00001C3.85074 8.00001 3.99998 7.85074 3.99998 7.66668C3.99998 7.01294 4.14479 6.61828 4.38151 6.38154C4.61825 6.14482 5.01289 6.00001 5.66665 6.00001C5.85074 6.00001 5.99998 5.85077 5.99998 5.66668C5.99998 5.48258 5.85074 5.33334 5.66665 5.33334C5.01289 5.33334 4.61825 5.18854 4.38151 4.95181C4.14479 4.71508 3.99998 4.32043 3.99998 3.66668Z"
        fill="#63635E"
      />
      <path
        d="M7.33331 0.99999C7.33331 0.815896 7.18405 0.666656 6.99998 0.666656C6.81591 0.666656 6.66665 0.815896 6.66665 0.99999C6.66665 1.42226 6.57277 1.65024 6.44483 1.77818C6.3169 1.90611 6.08892 1.99999 5.66665 1.99999C5.48255 1.99999 5.33331 2.14923 5.33331 2.33332C5.33331 2.51742 5.48255 2.66666 5.66665 2.66666C6.08892 2.66666 6.3169 2.76054 6.44483 2.88847C6.57277 3.0164 6.66665 3.24438 6.66665 3.66666C6.66665 3.85075 6.81591 3.99999 6.99998 3.99999C7.18405 3.99999 7.33331 3.85075 7.33331 3.66666C7.33331 3.24438 7.42718 3.0164 7.55511 2.88847C7.68305 2.76054 7.91105 2.66666 8.33331 2.66666C8.51738 2.66666 8.66665 2.51742 8.66665 2.33332C8.66665 2.14923 8.51738 1.99999 8.33331 1.99999C7.91105 1.99999 7.68305 1.90611 7.55511 1.77818C7.42718 1.65024 7.33331 1.42226 7.33331 0.99999Z"
        fill="#63635E"
      />
    </svg>
  );
}

function AddCircle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.33331 8C1.33331 4.3181 4.31808 1.33333 7.99998 1.33333C11.6818 1.33333 14.6666 4.3181 14.6666 8C14.6666 11.6819 11.6818 14.6667 7.99998 14.6667C4.31808 14.6667 1.33331 11.6819 1.33331 8ZM8.49998 5.17187C8.49998 4.89573 8.27611 4.67187 7.99998 4.67187C7.72385 4.67187 7.49998 4.89573 7.49998 5.17187V7.50033H5.17155C4.89541 7.50033 4.67155 7.72413 4.67155 8.00033C4.67155 8.27646 4.89541 8.50033 5.17155 8.50033H7.49998V10.8287C7.49998 11.1049 7.72385 11.3287 7.99998 11.3287C8.27611 11.3287 8.49998 11.1049 8.49998 10.8287V8.50033H10.8284C11.1046 8.50033 11.3284 8.27646 11.3284 8.00033C11.3284 7.72413 11.1046 7.50033 10.8284 7.50033H8.49998V5.17187Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.33333 9.3334L7.5286 7.13814C7.78893 6.8778 8.21106 6.8778 8.47139 7.13814L10.6667 9.3334"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function Gear() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.62522 2.06907C6.93165 1.60942 7.44751 1.33333 7.99998 1.33333C8.55245 1.33333 9.06831 1.60942 9.37471 2.06907L9.75478 2.63916C9.94705 2.92757 10.2978 3.06684 10.6356 2.9889L11.1044 2.88071C11.6688 2.75045 12.2606 2.92016 12.6702 3.32977C13.0798 3.73939 13.2495 4.33113 13.1192 4.89558L13.011 5.36442C12.9331 5.70218 13.0724 6.05291 13.3608 6.24518L13.9309 6.62523C14.3906 6.93166 14.6666 7.44753 14.6666 7.99999C14.6666 8.55246 14.3906 9.06833 13.9309 9.37473L13.3608 9.75479C13.0724 9.94706 12.9331 10.2978 13.011 10.6356L13.1192 11.1044C13.2495 11.6689 13.0798 12.2606 12.6702 12.6702C12.2606 13.0799 11.6688 13.2495 11.1044 13.1193L10.6356 13.0111C10.2978 12.9331 9.94705 13.0724 9.75478 13.3609L9.37471 13.9309C9.06831 14.3906 8.55245 14.6667 7.99998 14.6667C7.44751 14.6667 6.93165 14.3906 6.62522 13.9309L6.24517 13.3609C6.05289 13.0724 5.70216 12.9331 5.36441 13.0111L4.89557 13.1193C4.33111 13.2495 3.73938 13.0799 3.32976 12.6702C2.92015 12.2606 2.75043 11.6689 2.88069 11.1044L2.98889 10.6356C3.06683 10.2978 2.92756 9.94706 2.63915 9.75479L2.06906 9.37473C1.60941 9.06833 1.33331 8.55246 1.33331 7.99999C1.33331 7.44753 1.60941 6.93166 2.06906 6.62523L2.63915 6.24518C2.92756 6.05291 3.06683 5.70218 2.98889 5.36442L2.88069 4.89558C2.75043 4.33113 2.92014 3.73939 3.32976 3.32977C3.73938 2.92015 4.33111 2.75045 4.89557 2.88071L5.36441 2.9889C5.70216 3.06684 6.05289 2.92757 6.24517 2.63916L6.62522 2.06907ZM5.91665 7.99999C5.91665 6.84939 6.84938 5.91666 7.99998 5.91666C9.15058 5.91666 10.0833 6.84939 10.0833 7.99999C10.0833 9.15059 9.15058 10.0833 7.99998 10.0833C6.84938 10.0833 5.91665 9.15059 5.91665 7.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}
