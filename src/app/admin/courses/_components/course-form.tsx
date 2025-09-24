"use client";

import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActionButton } from "@/components/form/action-button";
import { Input } from "@/components/form/input";
import { Textarea } from "@/components/form/textarea";
import {
  buildCoursePayload,
  Course,
  CourseFormState,
  courseFormSchema,
  emptyCourseForm,
  formStateFromCourse,
} from "../_types/course";
import { persistCourse, removeCourse } from "../_lib/course-actions";

interface CourseFormProps {
  course?: Course;
  mode: "create" | "edit";
}

type Feedback = {
  type: "success" | "error" | "info";
  message: string;
};

type FieldName = keyof CourseFormState;

const fieldOrder: FieldName[] = [
  "title",
  "instructor",
  "price",
  "category",
  "description",
  "syllabus",
];

const feedbackStyles: Record<Feedback["type"], string> = {
  success: "border border-green-200 bg-green-50 text-green-800",
  error: "border border-red-200 bg-red-50 text-red-800",
  info: "border border-blue-200 bg-blue-50 text-blue-800",
};

export const CourseForm = ({ course, mode }: CourseFormProps): JSX.Element => {
  const [formValues, setFormValues] = useState<CourseFormState>(
    course ? formStateFromCourse(course) : emptyCourseForm,
  );
  const [persistedCourse, setPersistedCourse] = useState<Course | undefined>(course);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(course?.updatedAt ?? null);

  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  const titleRef = useRef<HTMLInputElement>(null);
  const instructorRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const syllabusRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs = useMemo(
    () => ({
      title: titleRef,
      instructor: instructorRef,
      price: priceRef,
      category: categoryRef,
      description: descriptionRef,
      syllabus: syllabusRef,
    }),
    [],
  );

  useEffect(() => {
    setFormValues(course ? formStateFromCourse(course) : emptyCourseForm);
    setPersistedCourse(course);
    setErrors({});
    setTouched({});
    setFeedback(null);
    setFormSubmitted(false);
    setIsDirty(false);
    setLastSavedAt(course?.updatedAt ?? null);
  }, [course]);

  useEffect(() => {
    if (feedback) {
      feedbackRef.current?.focus();
    }
  }, [feedback]);

  useEffect(() => {
    if (showDeleteModal) {
      cancelDeleteRef.current?.focus();
    }
  }, [showDeleteModal]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isDirty || isSaving || isDeleting || showDeleteModal) {
      return;
    }

    const validation = courseFormSchema.safeParse(formValues);
    if (!validation.success) {
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      setIsAutoSaving(true);
      try {
        const payload = buildCoursePayload(formValues, persistedCourse);
        const savedCourse = await persistCourse(payload, { autoSave: true });
        setPersistedCourse(savedCourse);
        setFormValues(formStateFromCourse(savedCourse));
        setLastSavedAt(savedCourse.updatedAt);
        setIsDirty(false);
        setFeedback((current) =>
          current?.type === "success"
            ? current
            : {
                type: "info",
                message: "Draft saved automatically.",
              },
        );
      } catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error ? error.message : "We couldn't auto-save your changes. Please try again.",
        });
      } finally {
        setIsAutoSaving(false);
      }
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formValues, isDirty, isSaving, isDeleting, showDeleteModal, persistedCourse]);

  const heading = "Course Details";
  const subheading = useMemo(() => {
    if (mode === "create" && !persistedCourse) {
      return "Create a new course by filling in the details below.";
    }

    if (!persistedCourse) {
      return "Update the course information.";
    }

    return `Editing ${persistedCourse.title}`;
  }, [mode, persistedCourse]);

  const helperText = useMemo(() => {
    if (isAutoSaving) {
      return "Saving draft...";
    }

    if (lastSavedAt) {
      const savedTime = new Date(lastSavedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `Last saved at ${savedTime}`;
    }

    return "All fields are required.";
  }, [isAutoSaving, lastSavedAt]);

  const handleFieldValidation = useCallback(
    (field: FieldName, value: string) => {
      const result = courseFormSchema.safeParse({
        ...formValues,
        [field]: value,
      });

      if (result.success) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        return true;
      }

      const fieldError = result.error.flatten().fieldErrors[field]?.[0];
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
      return false;
    },
    [formValues],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      const field = name as FieldName;
      const sanitizedValue = field === "price" ? value.replace(/[^0-9.]/g, "") : value;

      setFormValues((prev) => ({
        ...prev,
        [field]: sanitizedValue,
      }));
      setIsDirty(true);

      if (touched[field]) {
        handleFieldValidation(field, sanitizedValue);
      }
    },
    [handleFieldValidation, touched],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      const field = name as FieldName;

      setTouched((prev) => ({ ...prev, [field]: true }));
      handleFieldValidation(field, value);
    },
    [handleFieldValidation],
  );

  const validateForm = useCallback(() => {
    const validation = courseFormSchema.safeParse(formValues);
    if (validation.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = validation.error.flatten().fieldErrors;
    const nextErrors: Partial<Record<FieldName, string>> = {};
    fieldOrder.forEach((field) => {
      const message = fieldErrors[field]?.[0];
      if (message) {
        nextErrors[field] = message;
      }
    });
    setErrors(nextErrors);
    return false;
  }, [formValues]);

  const focusFirstError = useCallback(() => {
    for (const field of fieldOrder) {
      if (errors[field]) {
        fieldRefs[field]?.current?.focus();
        break;
      }
    }
  }, [errors, fieldRefs]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormSubmitted(true);
      setFeedback(null);

      const isValid = validateForm();
      if (!isValid) {
        setFeedback({ type: "error", message: "Please fix the errors highlighted below." });
        setTimeout(focusFirstError, 0);
        return;
      }

      setIsSaving(true);

      try {
        const payload = buildCoursePayload(formValues, persistedCourse);
        const savedCourse = await persistCourse(payload);
        setPersistedCourse(savedCourse);
        setFormValues(formStateFromCourse(savedCourse));
        setLastSavedAt(savedCourse.updatedAt);
        setIsDirty(false);
        setFeedback({ type: "success", message: "Course details saved successfully." });
      } catch (error) {
        setFeedback({
          type: "error",
          message: error instanceof Error ? error.message : "Something went wrong while saving the course.",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [focusFirstError, formValues, persistedCourse, validateForm],
  );

  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!persistedCourse?.id) {
      setShowDeleteModal(false);
      return;
    }

    setIsDeleting(true);
    setFeedback(null);

    try {
      await removeCourse(persistedCourse.id);
      setFeedback({ type: "info", message: "Course deleted. You can start a new draft now." });
      setPersistedCourse(undefined);
      setFormValues(emptyCourseForm);
      setErrors({});
      setTouched({});
      setFormSubmitted(false);
      setIsDirty(false);
      setLastSavedAt(null);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to delete the course. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }, [persistedCourse]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const shouldShowError = useCallback(
    (field: FieldName) => Boolean(errors[field] && (touched[field] || formSubmitted)),
    [errors, formSubmitted, touched],
  );

  const canDelete = Boolean(persistedCourse?.id);

  return (
    <section className="flex h-full flex-col">
      <header className="mb-8">
        <p className="text-3xl font-semibold text-black sm:text-4xl">{heading}</p>
        <p className="mt-2 text-base text-black/70 sm:text-lg">{subheading}</p>
      </header>

      {feedback && (
        <div
          ref={feedbackRef}
          role={feedback.type === "error" ? "alert" : "status"}
          tabIndex={-1}
          className={`mb-6 rounded-xl px-4 py-3 text-sm sm:text-base ${feedbackStyles[feedback.type]}`}
          aria-live={feedback.type === "error" ? "assertive" : "polite"}
        >
          {feedback.message}
        </div>
      )}

      <form className="flex flex-1 flex-col" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-lg font-medium text-black">
              Course Title
            </label>
            <Input
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter course title"
              required
              ref={fieldRefs.title}
              errorMessage={shouldShowError("title") ? errors.title : undefined}
            />
            {shouldShowError("title") && (
              <p id="title-error" className="text-sm text-red-600" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="instructor" className="text-lg font-medium text-black">
              Instructor
            </label>
            <Input
              id="instructor"
              name="instructor"
              value={formValues.instructor}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter instructor name"
              required
              ref={fieldRefs.instructor}
              errorMessage={shouldShowError("instructor") ? errors.instructor : undefined}
            />
            {shouldShowError("instructor") && (
              <p id="instructor-error" className="text-sm text-red-600" role="alert">
                {errors.instructor}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-lg font-medium text-black">
              Price
            </label>
            <Input
              id="price"
              name="price"
              inputMode="decimal"
              value={formValues.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              required
              ref={fieldRefs.price}
              errorMessage={shouldShowError("price") ? errors.price : undefined}
            />
            {shouldShowError("price") && (
              <p id="price-error" className="text-sm text-red-600" role="alert">
                {errors.price}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-lg font-medium text-black">
              Category
            </label>
            <Input
              id="category"
              name="category"
              value={formValues.category}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. STEM"
              required
              ref={fieldRefs.category}
              errorMessage={shouldShowError("category") ? errors.category : undefined}
            />
            {shouldShowError("category") && (
              <p id="category-error" className="text-sm text-red-600" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-lg font-medium text-black">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Provide a brief overview of the course."
              rows={5}
              required
              ref={fieldRefs.description}
              errorMessage={shouldShowError("description") ? errors.description : undefined}
            />
            {shouldShowError("description") && (
              <p id="description-error" className="text-sm text-red-600" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="syllabus" className="text-lg font-medium text-black">
              Syllabus
            </label>
            <Textarea
              id="syllabus"
              name="syllabus"
              value={formValues.syllabus}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Outline the syllabus or upload details."
              rows={8}
              required
              ref={fieldRefs.syllabus}
              errorMessage={shouldShowError("syllabus") ? errors.syllabus : undefined}
            />
            {shouldShowError("syllabus") && (
              <p id="syllabus-error" className="text-sm text-red-600" role="alert">
                {errors.syllabus}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-black/60" aria-live="polite">
            {helperText}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {canDelete && (
              <ActionButton
                type="button"
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
                loadingLabel="Deleting"
              >
                Delete
              </ActionButton>
            )}
            <ActionButton type="submit" isLoading={isSaving} loadingLabel="Saving">
              Save
            </ActionButton>
          </div>
        </div>
      </form>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-course-title"
            aria-describedby="delete-course-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          >
            <h2 id="delete-course-title" className="text-xl font-semibold text-black">
              Delete this course?
            </h2>
            <p id="delete-course-description" className="mt-2 text-sm text-black/70">
              This action cannot be undone. Deleting the course will remove all related content from the platform.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <ActionButton
                ref={cancelDeleteRef}
                type="button"
                variant="ghost"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </ActionButton>
              <ActionButton
                type="button"
                variant="danger"
                onClick={confirmDelete}
                isLoading={isDeleting}
                loadingLabel="Deleting"
              >
                Delete
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
