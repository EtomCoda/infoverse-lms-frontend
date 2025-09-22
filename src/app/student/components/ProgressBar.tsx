"use client";

import clsx from "clsx";
import { getProgressColor } from "@/utils/learningAnalytics";

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar = ({ value, showLabel = true, label, className }: ProgressBarProps) => {
  const progress = Math.min(Math.max(value, 0), 100);
  const progressColor = getProgressColor(progress);

  return (
    <div className={clsx("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>{label ?? "Progress"}</span>
          <span aria-live="polite">{progress}%</span>
        </div>
      )}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={label ?? "Course progress"}
      >
        <div
          className={clsx("h-full rounded-full transition-all duration-500 ease-out", progressColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
