import Link from 'next/link';

import { mockCourses } from '@/utils/course';

const HomePage = () => {
  const featuredCourse = mockCourses[0];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <div className="max-w-2xl space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Course detail experience</p>
        <h1 className="text-4xl font-semibold text-slate-900">Explore Infoverse course pages</h1>
        <p className="text-lg text-slate-600">
          Jump straight into the conversion-focused landing experience built for prospective students and parents.
        </p>
        <Link
          href={`/courses/${featuredCourse.id}`}
          className="inline-flex items-center gap-3 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-sky-600/40 transition hover:bg-sky-500"
        >
          View course detail<span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
};

export default HomePage;
