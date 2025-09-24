import type { PropsWithChildren } from "react";
import { AdminSidebar as Sidebar } from "../../components/AdminSidebar";
import { CourseForm } from "../_components/course-form";
import { fetchCourseById } from "../_lib/course-actions";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

const PageWrapper = ({ children }: PropsWithChildren): JSX.Element => (
  <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-[1440px]">
      <div className="flex flex-col gap-6 rounded-3xl bg-[#33a1cd] p-4 sm:p-6 lg:flex-row lg:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default async function CourseDetailsPage({ params }: CoursePageProps): Promise<JSX.Element> {
  const isCreateMode = params.courseId === "new";
  const course = isCreateMode ? null : await fetchCourseById(params.courseId);
  const resolvedMode: "create" | "edit" = !course || isCreateMode ? "create" : "edit";
  const courseNotFound = !isCreateMode && !course;

  return (
    <PageWrapper>
      <div className="lg:w-64">
        <Sidebar activePath="/courses" />
      </div>
      <main className="flex-1 rounded-2xl bg-[#f3f3f3] p-6 shadow-sm sm:p-10">
        {courseNotFound && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            We couldn&apos;t find the course you were looking for. You can create a new course below.
          </div>
        )}
        <CourseForm course={course ?? undefined} mode={resolvedMode} />
      </main>
    </PageWrapper>
  );
}
