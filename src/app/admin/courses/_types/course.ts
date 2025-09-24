import { z } from "zod";

export const courseFormSchema = z.object({
  title: z.string().trim().min(1, "Course title is required."),
  instructor: z.string().trim().min(1, "Instructor name is required."),
  price: z
    .string()
    .trim()
    .min(1, "Price is required.")
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Enter a valid price (numbers only, up to two decimals)."),
  category: z.string().trim().min(1, "Category is required."),
  description: z
    .string()
    .trim()
    .min(10, "Description should be at least 10 characters long."),
  syllabus: z
    .string()
    .trim()
    .min(10, "Syllabus should be at least 10 characters long."),
});

export type CourseFormState = z.infer<typeof courseFormSchema>;

export interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  category: string;
  description: string;
  syllabus: string;
  createdAt: string;
  updatedAt: string;
}

export type CoursePayload = Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export const emptyCourseForm: CourseFormState = {
  title: "",
  instructor: "",
  price: "",
  category: "",
  description: "",
  syllabus: "",
};

export const formStateFromCourse = (course: Course): CourseFormState => ({
  title: course.title ?? "",
  instructor: course.instructor ?? "",
  price: Number.isFinite(course.price) ? course.price.toString() : "",
  category: course.category ?? "",
  description: course.description ?? "",
  syllabus: course.syllabus ?? "",
});

export const generateCourseId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `course_${Math.random().toString(36).slice(2, 10)}`;
};

export const buildCoursePayload = (
  form: CourseFormState,
  course?: Course,
  overrides?: Partial<CoursePayload>,
): CoursePayload => {
  const now = new Date().toISOString();
  const base: CoursePayload = {
    id: course?.id ?? generateCourseId(),
    title: form.title.trim(),
    instructor: form.instructor.trim(),
    price: Number.parseFloat(form.price.trim()),
    category: form.category.trim(),
    description: form.description.trim(),
    syllabus: form.syllabus.trim(),
    createdAt: course?.createdAt ?? now,
    updatedAt: now,
  };

  return { ...base, ...overrides };
};
