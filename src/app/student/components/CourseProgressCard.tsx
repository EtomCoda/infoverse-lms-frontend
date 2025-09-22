"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import { EnrolledCourse, LearningProgress } from "@/types/learning";
import {
  buildCourseBreadcrumb,
  formatHours,
  formatMinutes,
  getDifficultyColor,
  getNextLessonLabel,
} from "@/utils/learningAnalytics";
import { ProgressBar } from "./ProgressBar";

interface CourseProgressCardProps {
  course: EnrolledCourse;
  progress: LearningProgress | undefined;
  onResume?: (course: EnrolledCourse) => void;
  onOpenCourse?: (course: EnrolledCourse) => void;
}

interface QuickActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const QuickActionButton = ({ variant = "primary", className, ...props }: QuickActionButtonProps) => (
  <button
    {...props}
    className={clsx(
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
      variant === "primary"
        ? "bg-sky-600 text-white hover:bg-sky-500 focus-visible:outline-sky-600"
        : "border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-600 focus-visible:outline-sky-600",
      className,
    )}
  />
);

export const CourseProgressCard = ({ course, progress, onResume, onOpenCourse }: CourseProgressCardProps) => {
  const breadcrumbs = buildCourseBreadcrumb(course);

  return (
    <article
      className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      aria-labelledby={`course-${course.id}`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                  getDifficultyColor(course.difficulty),
                )}
              >
                {course.difficulty}
              </span>
              <span className="text-xs text-slate-500" aria-label="Estimated time to complete">
                {formatHours(course.estimatedTimeToComplete)} remaining
              </span>
            </div>
            <h3 id={`course-${course.id}`} className="mt-2 text-lg font-semibold text-slate-900">
              {course.name}
            </h3>
            <p className="text-sm text-slate-500">Instructor · {course.instructor}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-medium text-slate-700">Last accessed</p>
            <p>{course.lastAccessed.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Course breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb} className="flex items-center gap-2">
              <span>{crumb}</span>
              {index < breadcrumbs.length - 1 && <span aria-hidden="true">/</span>}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <ProgressBar value={course.progress} />
          <p className="text-sm font-medium text-slate-600">{getNextLessonLabel(course)}</p>
          {progress && (
            <dl className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <dt className="font-medium text-slate-500">Lessons completed</dt>
                <dd className="text-slate-900">
                  {progress.lessonsCompleted} / {progress.totalLessons}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Time spent</dt>
                <dd className="text-slate-900">{formatMinutes(progress.timeSpent)}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <QuickActionButton onClick={() => onResume?.(course)}>Continue learning</QuickActionButton>
        <QuickActionButton variant="secondary" onClick={() => onOpenCourse?.(course)}>
          View details
        </QuickActionButton>
      </div>
    </article>
  );
};
