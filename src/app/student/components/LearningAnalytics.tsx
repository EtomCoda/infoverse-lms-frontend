"use client";

import {
  calculateAveragePace,
  calculateAverageQuizScore,
  calculateCompletionRate,
  calculateTotalCertificates,
  formatMinutes,
  getProgressColor,
} from "@/utils/learningAnalytics";
import { EnrolledCourse, LearningProgress } from "@/types/learning";

interface LearningAnalyticsProps {
  courses: EnrolledCourse[];
  progress: LearningProgress[];
}

export const LearningAnalytics = ({ courses, progress }: LearningAnalyticsProps) => {
  const overallCompletion = calculateCompletionRate(progress);
  const completionBarWidth = Math.min(overallCompletion, 100);
  const averageScore = calculateAverageQuizScore(progress);
  const certificatesEarned = calculateTotalCertificates(progress);
  const averagePace = calculateAveragePace(progress);
  const averagePaceLabel = averagePace ? formatMinutes(averagePace) : "N/A";
  const totalLearningMinutes = progress.reduce((acc, item) => acc + item.timeSpent, 0);

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-6 shadow-sm"
      aria-label="Learning analytics"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Learning analytics</h2>
          <p className="text-sm text-slate-600">
            Stay motivated with insights about your study habits and performance.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs font-medium text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Active streak · {courses.length} courses in progress
        </div>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-sm font-medium text-slate-600">Completion rate</dt>
          <dd className="mt-3 flex items-center gap-4">
            <span className="text-3xl font-bold text-slate-900">{overallCompletion}%</span>
            <span
              className={`inline-flex h-2 w-20 overflow-hidden rounded-full bg-slate-200`}
              aria-hidden="true"
            >
              <span
                className={`block h-full rounded-full ${getProgressColor(overallCompletion)}`}
                style={{ width: `${completionBarWidth}%` }}
              />
            </span>
          </dd>
          <p className="mt-3 text-xs text-slate-500">
            Keep your streak alive to reach new milestones and unlock certificates.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-sm font-medium text-slate-600">Average quiz score</dt>
          <dd className="mt-3 text-3xl font-bold text-slate-900">{averageScore}%</dd>
          <p className="mt-3 text-xs text-slate-500">Review quizzes to boost retention and improve mastery.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-sm font-medium text-slate-600">Learning time</dt>
          <dd className="mt-3 text-3xl font-bold text-slate-900">{formatMinutes(totalLearningMinutes)}</dd>
          <p className="mt-3 text-xs text-slate-500">Plan sessions and sync with your calendar to maintain balance.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <dt className="text-sm font-medium text-slate-600">Certificates earned</dt>
          <dd className="mt-3 text-3xl font-bold text-slate-900">{certificatesEarned}</dd>
          <p className="mt-3 text-xs text-slate-500">Share achievements with your community and study groups.</p>
        </div>
      </dl>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-sky-200 bg-white/80 p-4">
          <h3 className="text-sm font-semibold text-slate-700">Smart resume</h3>
          <p className="mt-2 text-sm text-slate-600">
            You typically complete a lesson every {averagePaceLabel}. Jump back into your next lesson to continue the
            streak.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-sky-200 bg-white/80 p-4">
          <h3 className="text-sm font-semibold text-slate-700">Adaptive recommendations</h3>
          <p className="mt-2 text-sm text-slate-600">
            Our AI analyzes your progress and suggests courses that close skill gaps and match your goals.
          </p>
        </div>
      </div>
    </section>
  );
};
