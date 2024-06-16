import type { Row } from "@/app/_lib/script";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
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
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  useEffect(() => {
    if (ref.current) {
      const height = ref.current.getBoundingClientRect().height;
      setHeight(height);
      y.set(height + 8);
      onHeightMeasured(height);
    }
  }, []);

  useEffect(() => {
    if (!height) return;
    if (open) {
      animate(y, 0, SPRING_CONFIG);
    } else {
      animate(y, height + 8, SPRING_CONFIG);
    }
  }, [open, height]);

  return (
    <motion.div
      ref={wrapperRef}
      id="translation"
      className={clsx(
        "border border-b-0 bg-sand-1 rounded-tl-xl rounded-tr-xl py-3 max-h-[50dvh] overflow-auto fixed bottom-0 w-screen",
        open ? "border-sand-6 dark:bg-sand-2" : "border-sand-1"
      )}
      style={{ y }}
    >
      <button
        className="text-sand-11 text-xs justify-between flex items-center w-full px-8 py-3"
        onClick={() => onOpenChange(!open)}
      >
        <span className="flex items-center gap-1">
          <span
            className={clsx("block transition-transform", open && "rotate-180")}
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
      <div
        ref={ref}
        className={clsx(
          "text-sm px-8 overflow-hidden mt-2",
          !height && "absolute"
        )}
      >
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
                  <button className="flex items-center p-2 w-full hover:bg-sand-3 rounded-lg">
                    <span className="font-jp">{word.word}</span>
                    <span className="font-jp text-sand-11 ml-1">
                      {word.reading}
                    </span>
                    <span className="text-sand-11 ml-auto flex gap-2">
                      <span className="ml-auto text-xs">{word.meaning}</span>
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
    </motion.div>
  );
}

// ---

function Loader() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00025 1.33333C8.27638 1.33335 8.50018 1.55723 8.50018 1.83337L8.49998 4.16671C8.49998 4.44285 8.27605 4.66669 7.99991 4.66666C7.72378 4.66663 7.49998 4.44276 7.49998 4.16661L7.50018 1.83328C7.50018 1.55714 7.72411 1.3333 8.00025 1.33333ZM3.28611 3.28577C3.48139 3.09053 3.79797 3.09055 3.99321 3.28583L5.64299 4.93589C5.83823 5.13117 5.83821 5.44775 5.64293 5.643C5.44765 5.83825 5.13107 5.83822 4.93582 5.64294L3.28605 3.99288C3.0908 3.7976 3.09083 3.48102 3.28611 3.28577ZM12.7144 3.28628C12.9096 3.48154 12.9096 3.79812 12.7144 3.99339L11.0644 5.6433C10.8692 5.83856 10.5526 5.83856 10.3573 5.6433C10.162 5.44804 10.162 5.13145 10.3573 4.93619L12.0072 3.28628C12.2025 3.09101 12.5191 3.09101 12.7144 3.28628ZM1.33331 8.00046C1.33331 7.72433 1.55717 7.50046 1.83331 7.50046H4.16665C4.44279 7.50046 4.66665 7.72433 4.66665 8.00046C4.66665 8.27659 4.44279 8.50046 4.16665 8.50046H1.83331C1.55717 8.50046 1.33331 8.27659 1.33331 8.00046ZM11.3333 8.00046C11.3333 7.72433 11.5572 7.50046 11.8333 7.50046H14.1666C14.4428 7.50046 14.6666 7.72433 14.6666 8.00046C14.6666 8.27659 14.4428 8.50046 14.1666 8.50046H11.8333C11.5572 8.50046 11.3333 8.27659 11.3333 8.00046ZM10.3571 10.3569C10.5524 10.1616 10.869 10.1616 11.0642 10.3569L12.7142 12.0068C12.9094 12.2021 12.9094 12.5187 12.7142 12.7139C12.5189 12.9091 12.2023 12.9091 12.007 12.7139L10.3571 11.064C10.1619 10.8687 10.1619 10.5521 10.3571 10.3569ZM5.64329 10.3573C5.83855 10.5526 5.83855 10.8692 5.64329 11.0645L3.99337 12.7144C3.79811 12.9097 3.48153 12.9097 3.28627 12.7144C3.091 12.5191 3.091 12.2025 3.28627 12.0073L4.93618 10.3573C5.13144 10.1621 5.44803 10.1621 5.64329 10.3573ZM8.00018 11.3333C8.27631 11.3333 8.50018 11.5572 8.50018 11.8333V14.1667C8.50018 14.4428 8.27631 14.6667 8.00018 14.6667C7.72405 14.6667 7.50018 14.4428 7.50018 14.1667V11.8333C7.50018 11.5572 7.72405 11.3333 8.00018 11.3333Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
        fill="currentColor"
      />
      <path
        d="M3.99998 3.66668C3.99998 3.48258 3.85074 3.33334 3.66665 3.33334C3.48255 3.33334 3.33331 3.48258 3.33331 3.66668C3.33331 4.32043 3.18851 4.71508 2.95178 4.95181C2.71505 5.18854 2.3204 5.33334 1.66665 5.33334C1.48255 5.33334 1.33331 5.48258 1.33331 5.66668C1.33331 5.85077 1.48255 6.00001 1.66665 6.00001C2.3204 6.00001 2.71505 6.14482 2.95178 6.38154C3.18851 6.61828 3.33331 7.01294 3.33331 7.66668C3.33331 7.85074 3.48255 8.00001 3.66665 8.00001C3.85074 8.00001 3.99998 7.85074 3.99998 7.66668C3.99998 7.01294 4.14479 6.61828 4.38151 6.38154C4.61825 6.14482 5.01289 6.00001 5.66665 6.00001C5.85074 6.00001 5.99998 5.85077 5.99998 5.66668C5.99998 5.48258 5.85074 5.33334 5.66665 5.33334C5.01289 5.33334 4.61825 5.18854 4.38151 4.95181C4.14479 4.71508 3.99998 4.32043 3.99998 3.66668Z"
        fill="currentColor"
      />
      <path
        d="M7.33331 0.99999C7.33331 0.815896 7.18405 0.666656 6.99998 0.666656C6.81591 0.666656 6.66665 0.815896 6.66665 0.99999C6.66665 1.42226 6.57277 1.65024 6.44483 1.77818C6.3169 1.90611 6.08892 1.99999 5.66665 1.99999C5.48255 1.99999 5.33331 2.14923 5.33331 2.33332C5.33331 2.51742 5.48255 2.66666 5.66665 2.66666C6.08892 2.66666 6.3169 2.76054 6.44483 2.88847C6.57277 3.0164 6.66665 3.24438 6.66665 3.66666C6.66665 3.85075 6.81591 3.99999 6.99998 3.99999C7.18405 3.99999 7.33331 3.85075 7.33331 3.66666C7.33331 3.24438 7.42718 3.0164 7.55511 2.88847C7.68305 2.76054 7.91105 2.66666 8.33331 2.66666C8.51738 2.66666 8.66665 2.51742 8.66665 2.33332C8.66665 2.14923 8.51738 1.99999 8.33331 1.99999C7.91105 1.99999 7.68305 1.90611 7.55511 1.77818C7.42718 1.65024 7.33331 1.42226 7.33331 0.99999Z"
        fill="currentColor"
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
        fillRule="evenodd"
        clipRule="evenodd"
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
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
