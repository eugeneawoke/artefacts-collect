"use client";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  hint,
}: SliderProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className="text-2xl font-bold tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-12 appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full
          [&::-webkit-slider-runnable-track]:bg-[var(--bg-elevated)]
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)]
          [&::-webkit-slider-thumb]:mt-[-12px] [&::-webkit-slider-thumb]:shadow-lg"
      />
      <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {hint && (
        <p className="text-[10px] text-[var(--text-secondary)]/60 mt-1">{hint}</p>
      )}
    </div>
  );
}
