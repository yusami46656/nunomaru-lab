type StampProps = {
  label: string;
  className?: string;
};

export function Stamp({ label, className = "" }: StampProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border-2 border-dashed border-brass-600/60 px-2.5 py-1 font-serif text-[11px] uppercase tracking-[0.2em] text-brass-700 ${className}`}
    >
      <span aria-hidden>※</span>
      {label}
    </span>
  );
}
