import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CourseCurriculum from '@/components/course/CourseCurriculum';
import CourseDescription from '@/components/course/CourseDescription';
import CourseDetailLayout from '@/components/course/CourseDetailLayout';
import CourseHero from '@/components/course/CourseHero';
import CourseReviews from '@/components/course/CourseReviews';
import CourseStructuredData from '@/components/course/CourseStructuredData';
import EnrollmentCTA from '@/components/course/EnrollmentCTA';
import InstructorProfile from '@/components/course/InstructorProfile';
import SocialProof from '@/components/course/SocialProof';
import { getAllCourseIds, getCourseDetail, getCourseMetadata } from '@/utils/course';

interface CourseDetailPageProps {
  params: { courseId: string };
}

export async function generateStaticParams() {
  return getAllCourseIds().map((id) => ({ courseId: id }));
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const course = getCourseDetail(params.courseId);

  if (!course) {
    return {
      title: 'Course not found | Infoverse Learning',
      description: 'We could not locate the requested Infoverse Learning course.',
    };
  }

  return getCourseMetadata(course);
}

const CourseDetailPage = ({ params }: CourseDetailPageProps) => {
  const course = getCourseDetail(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <>
      <CourseStructuredData course={course} />
      <CourseDetailLayout
        course={course}
        sticky={<EnrollmentCTA course={course} />}
        sidebar={
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/10 p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100">Support</p>
              <ul className="mt-3 space-y-2 text-sky-50/90">
                <li>Flexible payment plans</li>
                <li>Exam board aligned modules</li>
                <li>Progress tracking dashboard</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-100">Need help?</p>
              <p className="mt-2">Book a call with our admissions advisors for tailored guidance.</p>
              <a
                href="/consultation"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700"
              >
                Schedule a consultation<span aria-hidden>→</span>
              </a>
            </div>
          </div>
        }
      >
        <CourseHero course={course} />
        <CourseDescription course={course} />
        <CourseCurriculum course={course} />
        <InstructorProfile instructor={course.instructor} />
        <SocialProof course={course} />
        <CourseReviews course={course} />
        <EnrollmentCTA course={course} />
      </CourseDetailLayout>
    </>
  );
};

export default CourseDetailPage;
