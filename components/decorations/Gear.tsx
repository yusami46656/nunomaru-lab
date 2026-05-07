import type { SVGProps } from "react";

type GearProps = SVGProps<SVGSVGElement> & {
  teeth?: number;
};

export function Gear({ teeth = 12, className, ...rest }: GearProps) {
  const outerR = 48;
  const innerR = 36;
  const toothPath = Array.from({ length: teeth })
    .map((_, i) => {
      const angle = (i / teeth) * Math.PI * 2;
      const next = ((i + 0.5) / teeth) * Math.PI * 2;
      const x1 = 50 + Math.cos(angle) * outerR;
      const y1 = 50 + Math.sin(angle) * outerR;
      const x2 = 50 + Math.cos(next) * innerR;
      const y2 = 50 + Math.sin(next) * innerR;
      return `${i === 0 ? "M" : "L"}${x1.toFixed(2)},${y1.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)}`;
    })
    .join(" ") + " Z";

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        d={toothPath}
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="50" cy="50" r="22" fill="rgba(253, 250, 243, 0.85)" />
      <circle
        cx="50"
        cy="50"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.8" />
    </svg>
  );
}
