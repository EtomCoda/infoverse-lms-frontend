'use client';

import { useState } from 'react';

import type { CourseDetail, CourseModule } from '@/types/course';

interface CourseCurriculumProps {
  course: CourseDetail;
}

const CourseCurriculum = ({ course }: CourseCurriculumProps) => {
  const [activeModule, setActiveModule] = useState<CourseModule | null>(course.curriculum[0] ?? null);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Curriculum</p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-900">Explore the learning journey</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Follow the learning path from diagnostics to exam mastery. Preview lessons and assessments designed for
              lasting results.
            </p>
          </div>
          <div className="space-y-3">
            {course.curriculum.map((module) => {
              const isActive = activeModule?.id === module.id;
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveModule(module)}
                  className={`w-full rounded-2xl border px-5 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                    isActive
                      ? 'border-sky-500 bg-sky-50 shadow-lg shadow-sky-100'
                      : 'border-slate-200 bg-white hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{module.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{module.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {module.duration} hrs
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {activeModule && (
          <div className="flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Module spotlight</p>
              <h4 className="mt-2 text-2xl font-semibold text-slate-900">{activeModule.title}</h4>
              <p className="mt-2 text-sm text-slate-500">{activeModule.description}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Lessons</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {activeModule.lessons.map((lesson) => (
                  <li key={lesson.id} className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{lesson.title}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{lesson.duration} hrs</p>
                      </div>
                      {lesson.isSample && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                          Preview
                        </span>
                      )}
                    </div>
                    {lesson.previewUrl && (
                      <a
                        href={lesson.previewUrl}
                        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-600"
                      >
                        Watch sample<span aria-hidden>→</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Assessments</p>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {activeModule.assessments.map((assessment) => (
                  <li key={assessment.id} className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="font-semibold text-slate-900">{assessment.title}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {assessment.type} {assessment.duration ? `• ${assessment.duration} hrs` : ''}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{assessment.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-4 text-xs text-slate-500">
              <p className="font-semibold text-slate-600">
                Preview availability: {activeModule.isPreviewAvailable ? 'Request access now' : 'Unlock after enrolment'}
              </p>
              <p className="mt-1">
                Lessons marked “Preview” can be accessed instantly after creating a free account.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseCurriculum;
