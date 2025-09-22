import Image from 'next/image';

import type { InstructorProfile as Instructor } from '@/types/course';

interface InstructorProfileProps {
  instructor: Instructor;
}

const InstructorProfile = ({ instructor }: InstructorProfileProps) => {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-sky-100">
              <Image
                src={instructor.avatar}
                alt={instructor.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Meet your tutor</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{instructor.name}</h3>
              <p className="text-sm font-semibold text-sky-700">{instructor.title}</p>
              <p className="mt-3 text-sm text-slate-500">
                {instructor.experience}
              </p>
            </div>
          </div>
          <p className="text-base leading-relaxed text-slate-600">{instructor.biography}</p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Credentials
              </h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {instructor.credentials.map((credential) => (
                  <li key={credential} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                    <span>{credential}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Specialisations
              </h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {instructor.specializations.map((specialisation) => (
                  <li key={specialisation} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                    <span>{specialisation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {instructor.achievements && instructor.achievements.length > 0 && (
            <div className="rounded-2xl bg-slate-50 p-6">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Student impact
              </h4>
              <ul className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {instructor.achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className="rounded-full bg-white px-4 py-2 text-slate-600 shadow-sm"
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {instructor.introVideoUrl && (
          <div className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Watch Sophia’s intro</p>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black/80">
              <iframe
                title={`Introduction from ${instructor.name}`}
                src={instructor.introVideoUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-sm text-slate-500">
              Hear how Sophia approaches high-stakes exam preparation and the accountability structures
              used across the course.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InstructorProfile;
