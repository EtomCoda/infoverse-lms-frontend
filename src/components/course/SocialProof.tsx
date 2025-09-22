import type { CourseDetail } from '@/types/course';

interface SocialProofProps {
  course: CourseDetail;
}

const SocialProof = ({ course }: SocialProofProps) => {
  const averageRating =
    course.reviews.reduce((total, review) => total + review.rating, 0) /
    Math.max(course.reviews.length, 1);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Trusted results</p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-900">Proof it works</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Average rating</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{averageRating.toFixed(1)}/5</p>
              <p className="text-xs text-slate-500">Across {course.reviews.length} verified reviews</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Success stories</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{course.successStories?.length ?? 0}</p>
              <p className="text-xs text-slate-500">Students accepted to dream programmes</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Success rate</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{(course.enrollment.successRate * 100).toFixed(0)}%</p>
              <p className="text-xs text-slate-500">Achieved grade uplift targets</p>
            </div>
          </div>
          {course.successStories && course.successStories.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {course.successStories.map((story) => (
                <blockquote
                  key={story.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600"
                >
                  <p className="font-semibold text-slate-900">{story.studentName}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{story.achievement}</p>
                  <p className="mt-3 text-slate-600">“{story.quote}”</p>
                </blockquote>
              ))}
            </div>
          )}
        </div>
        <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-slate-900 p-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Verified reviews</p>
            <h4 className="mt-2 text-2xl font-semibold text-white">What students say</h4>
          </div>
          <div className="space-y-5">
            {course.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-white/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-white">{review.studentName}</p>
                  <span className="text-sm text-amber-300">{review.rating.toFixed(1)}★</span>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{review.examBoard}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-100">{review.comment}</p>
                {review.improvement && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    {review.improvement}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-300">
                  {review.isVerified ? 'Verified enrolment' : 'Unverified'} ·{' '}
                  {new Intl.DateTimeFormat('en-GB', {
                    month: 'short',
                    year: 'numeric',
                  }).format(review.date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
