import { useId } from "react";

export function BackgroundDots({
  patternProps,
}: {
  patternProps?: React.ComponentPropsWithoutRef<"pattern">;
}) {
  const id = useId();
  return (
    <svg aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern
          id={id}
          viewBox="-5 -5 10 10"
          patternUnits="userSpaceOnUse"
          width="10"
          height="10"
          {...patternProps}
        >
          <circle cx="0" cy="0" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
