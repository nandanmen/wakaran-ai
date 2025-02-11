import { useId } from "react";

export function StripePattern({
  size = 8,
  ...props
}: {
  size?: number;
} & React.ComponentPropsWithoutRef<"pattern">) {
  return (
    <defs>
      <pattern
        viewBox="0 0 10 10"
        width={size}
        height={size}
        patternUnits="userSpaceOnUse"
        {...props}
      >
        <line
          x1="0"
          y1="10"
          x2="10"
          y2="0"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </pattern>
    </defs>
  );
}

export function BackgroundStripes({
  patternProps,
}: {
  patternProps?: React.ComponentPropsWithoutRef<"pattern">;
}) {
  const id = useId();
  return (
    <svg aria-hidden="true" width="100%" height="100%">
      <StripePattern id={id} {...patternProps} />
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
