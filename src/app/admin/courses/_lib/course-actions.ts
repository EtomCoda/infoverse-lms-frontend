import { buildCoursePayload, Course, CoursePayload, generateCourseId } from "../_types/course";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PersistCourseOptions {
  autoSave?: boolean;
  signal?: AbortSignal;
}

export const persistCourse = async (
  payload: CoursePayload,
  options: PersistCourseOptions = {},
): Promise<Course> => {
  const { autoSave = false, signal } = options;

  if (Number.isNaN(payload.price)) {
    throw new Error("Price must be a valid number.");
  }

  await delay(autoSave ? 400 : 800);

  if (signal?.aborted) {
    throw new DOMException("Request aborted", "AbortError");
  }

  const now = new Date().toISOString();

  return {
    ...payload,
    id: payload.id ?? generateCourseId(),
    price: Number(payload.price),
    createdAt: payload.createdAt ?? now,
    updatedAt: now,
  };
};

export const removeCourse = async (courseId: string, signal?: AbortSignal): Promise<void> => {
  if (!courseId) {
    throw new Error("Course id is required to delete a course.");
  }

  await delay(700);

  if (signal?.aborted) {
    throw new DOMException("Request aborted", "AbortError");
  }
};

export const fetchCourseById = async (courseId: string): Promise<Course | null> => {
  if (!courseId) {
    return null;
  }

  await delay(400);

  const seeded: Course = {
    id: courseId,
    title: "Advanced Mathematics",
    instructor: "Dr. Jane Doe",
    price: 199.99,
    category: "STEM",
    description:
      "Deep dive into advanced calculus, linear algebra, and differential equations tailored for competitive exams.",
    syllabus:
      "Week 1: Multivariable Calculus\nWeek 2: Differential Equations\nWeek 3: Linear Algebra\nWeek 4: Exam Strategy & Practice.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  };

  return seeded;
};

export const createDraftPayload = (course?: Course) =>
  buildCoursePayload(
    {
      title: course?.title ?? "",
      instructor: course?.instructor ?? "",
      price: course ? course.price.toString() : "",
      category: course?.category ?? "",
      description: course?.description ?? "",
      syllabus: course?.syllabus ?? "",
    },
    course,
  );
