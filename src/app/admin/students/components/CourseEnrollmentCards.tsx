import { TrendingUp, TrendingDown, Minus, Users2, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';
import type { SVGProps } from 'react';
import type { CourseEnrollment } from '@/types/enrollment';

interface CourseEnrollmentCardsProps {
  courses: CourseEnrollment[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onViewStudents: (courseId: string) => void;
}

const trendIconMap = {
  increasing: TrendingUp,
  stable: Minus,
  decreasing: TrendingDown,
};

const trendColorMap = {
  increasing: 'text-emerald-600',
  stable: 'text-slate-500',
  decreasing: 'text-rose-600',
};

export function CourseEnrollmentCards({
  courses,
  selectedCourseId,
  onSelectCourse,
  onViewStudents,
}: CourseEnrollmentCardsProps) {
  return (
    <section aria-label="Course enrollment overview">
      <h2 className="text-2xl font-semibold text-slate-900">Course Overview</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {courses.map((course) => {
          const TrendIcon = trendIconMap[course.enrollmentTrend];
          return (
            <article
              key={course.courseId}
              className={clsx(
                'flex h-full flex-col rounded-2xl border border-slate-200 bg-[#BDD0D2]/60 p-6 shadow-sm transition-all',
                selectedCourseId === course.courseId
                  ? 'ring-2 ring-offset-2 ring-[#33A1CD] ring-offset-white'
                  : 'hover:shadow-md',
              )}
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-slate-600">Course</p>
                  <h3 className="text-xl font-semibold text-slate-900">{course.courseName}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCourse(course.courseId)}
                  className={clsx(
                    'rounded-full px-4 py-1 text-sm font-semibold transition-colors',
                    selectedCourseId === course.courseId
                      ? 'bg-[#33A1CD] text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100',
                  )}
                >
                  {selectedCourseId === course.courseId ? 'Selected' : 'Select'}
                </button>
              </header>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="rounded-xl bg-white/70 p-3">
                  <dt className="flex items-center gap-2 font-medium text-slate-600">
                    <Users2 className="h-4 w-4" aria-hidden="true" /> Total Enrolled
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-900">{course.totalEnrolled}</dd>
                </div>
                <div className="rounded-xl bg-white/70 p-3">
                  <dt className="flex items-center gap-2 font-medium text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" /> Active
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-emerald-700">{course.activeStudents}</dd>
                </div>
                <div className="rounded-xl bg-white/70 p-3">
                  <dt className="flex items-center gap-2 font-medium text-slate-600">
                    <GraduationStatIcon className="h-4 w-4 text-sky-600" aria-hidden="true" /> Completed
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-sky-700">{course.completedStudents}</dd>
                </div>
                <div className="rounded-xl bg-white/70 p-3">
                  <dt className="flex items-center gap-2 font-medium text-slate-600">
                    <XCircle className="h-4 w-4 text-rose-600" aria-hidden="true" /> Dropped
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-rose-700">{course.droppedStudents}</dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-col gap-4 pt-6">
                <div className="flex items-center justify-between rounded-xl bg-white/80 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Enrollment Trend</p>
                    <p className="text-sm text-slate-700">{course.enrollmentTrend}</p>
                  </div>
                  <TrendIcon className={clsx('h-6 w-6', trendColorMap[course.enrollmentTrend])} aria-hidden="true" />
                </div>
                <button
                  type="button"
                  onClick={() => onViewStudents(course.courseId)}
                  className="w-full rounded-xl bg-[#DD7C5E] px-4 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#c66a51] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#33A1CD] focus-visible:ring-offset-2"
                >
                  View Students Enrolled
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GraduationStatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path
        d="M3 7l9-4 9 4-9 4-9-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 10v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M3 10.5v5a2 2 0 0 0 1.05 1.75L12 21l7.95-3.75A2 2 0 0 0 21 15.5v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CourseEnrollmentCards;
