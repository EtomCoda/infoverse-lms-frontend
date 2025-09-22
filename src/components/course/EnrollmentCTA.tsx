'use client';

import { useEffect } from 'react';

import { useAnalytics } from '@/hooks/useAnalytics';
import { useEnrollment, type EnrollmentOption } from '@/hooks/useEnrollment';
import type { CourseDetail } from '@/types/course';
import { formatPrice } from '@/utils/course';

interface EnrollmentCTAProps {
  course: CourseDetail;
}

const options: { id: EnrollmentOption; label: string; description: string }[] = [
  {
    id: 'full-course',
    label: 'Full course access',
    description: 'All modules, live pods, exam clinics and study coach support',
  },
  {
    id: 'modular',
    label: 'Module bundles',
    description: 'Choose individual accelerators with tutor feedback and resources',
  },
  {
    id: 'trial',
    label: '14-day trial',
    description: 'Experience the platform with sample lessons and diagnostics',
  },
];

const EnrollmentCTA = ({ course }: EnrollmentCTAProps) => {
  const analytics = useAnalytics();
  const {
    selectedOption,
    setSelectedOption,
    isSubmitting,
    handleEnrol,
    hasPreviewAccess,
    handlePreviewToggle,
    spotsRemaining,
    urgencyLevel,
    conversionScore,
  } = useEnrollment({
    course,
    onEnrol: async (result) => {
      analytics.trackEnrollmentStart(course, result.option);
    },
  });

  useEffect(() => {
    analytics.trackEngagement(course, 'enrolment-cta');
  }, [analytics, course]);

  const urgencyCopy = {
    critical: 'Final seats available — secure your spot before enrolment closes.',
    high: 'Limited availability — seats are filling quickly for this cohort.',
    steady: 'Secure your cohort placement and unlock immediate study resources.',
  }[urgencyLevel];

  return (
    <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/30">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Start now</p>
            <h3 className="mt-2 text-3xl font-semibold leading-tight">Ready to enrol?</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{urgencyCopy}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Spots left</p>
              <p className="mt-2 text-2xl font-semibold">{spotsRemaining}</p>
              <p className="text-xs text-slate-300">of {course.enrollment.totalStudents} cohort seats</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Conversion score</p>
              <p className="mt-2 text-2xl font-semibold">{conversionScore}</p>
              <p className="text-xs text-slate-300">Confidence based on outcomes</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Success rate</p>
              <p className="mt-2 text-2xl font-semibold">{(course.enrollment.successRate * 100).toFixed(0)}%</p>
              <p className="text-xs text-slate-300">Students hitting grade goals</p>
            </div>
          </div>
          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOption(option.id)}
                className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${
                  selectedOption === option.id
                    ? 'border-white bg-white/15 shadow-lg shadow-slate-900/40'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span
                  className={`mt-1 inline-flex h-3 w-3 rounded-full ${
                    selectedOption === option.id ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                  aria-hidden
                />
                <div>
                  <p className="text-base font-semibold text-white">{option.label}</p>
                  <p className="mt-1 text-sm text-slate-300">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-6 rounded-3xl bg-white p-6 text-slate-900">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Today’s enrolment</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatPrice(course.price.amount, course.price.currency)}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Flexible payment options available. Cancel or switch cohorts up to 48 hours before start.
            </p>
          </div>
          {course.promotions?.bonusMaterials && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Bonus for this cohort</p>
              <ul className="mt-2 space-y-1">
                {course.promotions.bonusMaterials.map((bonus) => (
                  <li key={bonus}>• {bonus}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            onClick={async () => {
              const result = await handleEnrol();
              analytics.trackConversion(course, course.price.amount);
              return result;
            }}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-sky-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-600/40 transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Securing your space…' : 'Enrol now'}
            <span aria-hidden>→</span>
          </button>
          <button
            type="button"
            onClick={handlePreviewToggle}
            className="text-sm font-semibold text-sky-600 hover:underline"
          >
            {hasPreviewAccess ? 'Hide sample lessons' : 'Access sample lessons'}
          </button>
          <div className="rounded-2xl bg-slate-100 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Money-back promise</p>
            <p className="mt-1">
              Try the course risk-free for 14 days. If it’s not the right fit, receive a full refund.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnrollmentCTA;
