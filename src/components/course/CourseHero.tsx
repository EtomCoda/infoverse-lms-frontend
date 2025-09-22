import { calculateDiscountedPrice, formatPrice } from '@/utils/course';
import type { CourseDetail } from '@/types/course';

interface CourseHeroProps {
  course: CourseDetail;
}

const CourseHero = ({ course }: CourseHeroProps) => {
  const discountPrice = calculateDiscountedPrice(course);
  const hasDiscount = Boolean(course.price.discount && course.price.originalPrice);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            <span>{course.level}</span>
            <span aria-hidden>•</span>
            <span className="capitalize">{course.difficulty} pathway</span>
          </div>
          <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            {course.title}
          </h2>
          <p className="text-lg leading-relaxed text-slate-600">{course.description}</p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm uppercase tracking-[0.2em] text-slate-400">Duration</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-800">
                {course.duration.weeks} weeks • {course.duration.hours} hours
              </dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.2em] text-slate-400">Exam Boards</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-800">
                {course.examBoards.join(' / ')}
              </dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-[0.2em] text-slate-400">Success Rate</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-800">
                {(course.enrollment.successRate * 100).toFixed(0)}% student success
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
          <div>
            <dt className="text-sm uppercase tracking-[0.3em] text-slate-500">Investment</dt>
            <dd className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-semibold text-slate-900">
                {formatPrice(discountPrice, course.price.currency)}
              </span>
              {hasDiscount && (
                <span className="text-base font-semibold text-sky-600">
                  Save {course.price.discount}%
                </span>
              )}
            </dd>
            {hasDiscount && (
              <p className="mt-1 text-sm text-slate-400 line-through">
                {formatPrice(course.price.originalPrice!, course.price.currency)}
              </p>
            )}
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            {course.price.paymentPlans?.map((plan) => (
              <div key={plan.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white p-4">
                <div>
                  <p className="font-semibold text-slate-900">{plan.label}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {plan.frequency === 'one-time' ? 'One-time payment' : `${plan.frequency} payments`}
                  </p>
                  {plan.benefits && (
                    <ul className="mt-2 space-y-1 text-xs text-slate-500">
                      {plan.benefits.map((benefit) => (
                        <li key={benefit}>• {benefit}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className="text-lg font-semibold text-sky-700">
                  {formatPrice(plan.amount, course.price.currency)}
                </span>
              </div>
            ))}
          </div>
          {course.promotions?.urgencyMessage && (
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">Limited-time bonus</p>
              <p className="mt-1 leading-relaxed">{course.promotions.urgencyMessage}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
