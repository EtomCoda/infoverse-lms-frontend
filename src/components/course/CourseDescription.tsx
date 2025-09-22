import type { CourseDetail } from '@/types/course';

interface CourseDescriptionProps {
  course: CourseDetail;
}

const CourseDescription = ({ course }: CourseDescriptionProps) => {
  return (
    <section className="grid gap-6 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60 lg:grid-cols-[3fr_2fr]">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-slate-900">Course overview</h3>
        <p className="text-lg leading-relaxed text-slate-600">{course.longDescription}</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Learning outcomes
            </h4>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              {course.learningOutcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              What’s included
            </h4>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              {course.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Prerequisites & suitability
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {course.prerequisites.map((prerequisite) => (
              <li key={prerequisite} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-amber-500" aria-hidden />
                <span>{prerequisite}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Materials</h4>
          <ul className="mt-3 space-y-4 text-sm text-slate-600">
            {course.materials.map((material) => (
              <li key={material.id} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-slate-900">{material.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                  {material.type} • {material.access} access
                </p>
                {material.url && (
                  <a
                    href={material.url}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-600"
                  >
                    Preview lesson<span aria-hidden>→</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        {course.guarantees && course.guarantees.length > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Confidence boosters
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-emerald-700">
              {course.guarantees.map((guarantee) => (
                <li key={guarantee} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  <span>{guarantee}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {course.relatedResources && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Continue your research
            </h4>
            <ul className="mt-3 space-y-3 text-sm text-sky-700">
              {course.relatedResources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    className="inline-flex items-center gap-2 font-semibold hover:underline"
                  >
                    {resource.title}
                    <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </section>
  );
};

export default CourseDescription;
