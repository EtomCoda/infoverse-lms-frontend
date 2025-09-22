'use client';

import { useMemo, useState } from 'react';

import type { CourseDetail } from '@/types/course';

interface CourseReviewsProps {
  course: CourseDetail;
}

const filters = ['all', 'verified', 'a-level', 'ib-diploma', 'gcse'] as const;

const CourseReviews = ({ course }: CourseReviewsProps) => {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('all');
  const [minimumRating, setMinimumRating] = useState(0);

  const filteredReviews = useMemo(() => {
    return course.reviews.filter((review) => {
      const meetsRating = review.rating >= minimumRating;
      const matchesFilter = (() => {
        switch (activeFilter) {
          case 'verified':
            return review.isVerified;
          case 'a-level':
            return review.examBoard.toLowerCase().includes('a');
          case 'ib-diploma':
            return review.examBoard.toLowerCase().includes('ib');
          case 'gcse':
            return review.examBoard.toLowerCase().includes('gcse');
          default:
            return true;
        }
      })();
      return meetsRating && matchesFilter;
    });
  }, [activeFilter, course.reviews, minimumRating]);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonials</p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-900">Student feedback</h3>
            <p className="mt-2 text-sm text-slate-500">
              Hear from students and families who have progressed through the course and achieved their grade goals.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  activeFilter === filter
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-sky-200'
                }`}
              >
                {filter.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="rating" className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Minimum rating
          </label>
          <input
            id="rating"
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={minimumRating}
            onChange={(event) => setMinimumRating(Number(event.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-sky-600"
          />
          <span className="text-sm font-semibold text-slate-600">{minimumRating.toFixed(1)}★</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredReviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">{review.studentName}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{review.examBoard}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-amber-500">
                  {review.rating.toFixed(1)}★
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
              {review.gradeAchieved && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Grade outcome: {review.gradeAchieved}
                </p>
              )}
              <p className="mt-3 text-xs text-slate-500">
                {review.isVerified ? 'Verified enrolment' : 'Unverified'} ·{' '}
                {new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(review.date)}
              </p>
            </article>
          ))}
          {filteredReviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              No reviews match the current filters. Try adjusting the rating slider or filter selection.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseReviews;
