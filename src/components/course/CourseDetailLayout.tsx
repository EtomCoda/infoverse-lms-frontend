import type { PropsWithChildren, ReactNode } from 'react';

import type { CourseDetail } from '@/types/course';

interface CourseDetailLayoutProps extends PropsWithChildren {
  course: CourseDetail;
  sidebar?: ReactNode;
  sticky?: ReactNode;
}

const CourseDetailLayout = ({ course, sidebar, sticky, children }: CourseDetailLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden rounded-3xl bg-sky-600/95 p-8 text-white shadow-2xl shadow-sky-900/20 lg:block">
            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-sky-100">Course overview</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight">{course.title}</h1>
              </div>
              <div className="space-y-6 text-sm leading-relaxed text-sky-50/90">
                <p>{course.description}</p>
                <div className="rounded-2xl bg-sky-700/60 p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">Fast facts</h2>
                  <dl className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <dt>Duration</dt>
                      <dd>
                        {course.duration.weeks} weeks • {course.duration.hours} hours
                      </dd>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <dt>Level</dt>
                      <dd>{course.level}</dd>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <dt>Difficulty</dt>
                      <dd className="capitalize">{course.difficulty}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
                    Exam boards
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {course.examBoards.map((board) => (
                      <li
                        key={board}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase"
                      >
                        {board}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {sidebar}
            </div>
          </aside>
          <main className="space-y-10">
            {sticky && <div className="lg:hidden">{sticky}</div>}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailLayout;
