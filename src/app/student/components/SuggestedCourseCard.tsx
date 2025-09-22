"use client";

import clsx from "clsx";
import { SuggestedCourse } from "@/types/learning";
import { formatHours, getDifficultyColor } from "@/utils/learningAnalytics";

interface SuggestedCourseCardProps {
  course: SuggestedCourse;
  onEnroll?: (course: SuggestedCourse) => void;
}

export const SuggestedCourseCard = ({ course, onEnroll }: SuggestedCourseCardProps) => {
  const difficultyColor = getDifficultyColor(course.difficulty);

  return (
    <article
      className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      aria-labelledby={`suggested-${course.id}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span
            className={clsx(
              "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
              difficultyColor,
            )}
          >
            {course.difficulty}
          </span>
          <div className="text-right text-xs text-slate-500">
            <p className="font-medium text-slate-700">Rating</p>
            <p aria-label="Average learner rating">{course.rating.toFixed(1)} ★</p>
          </div>
        </div>

        <div>
          <h3 id={`suggested-${course.id}`} className="text-lg font-semibold text-slate-900">
            {course.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{course.description}</p>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <dt className="font-medium text-slate-500">Duration</dt>
            <dd>{formatHours(course.duration)}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Learners enrolled</dt>
            <dd>{course.enrollmentCount.toLocaleString()}</dd>
          </div>
          {typeof course.price === "number" && (
            <div>
              <dt className="font-medium text-slate-500">Pricing</dt>
              <dd>{course.price === 0 ? "Included in plan" : `$${course.price}`}</dd>
            </div>
          )}
        </dl>

        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onEnroll?.(course)}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      >
        Enroll now
      </button>
    </article>
  );
};
