'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import CourseEnrollmentCards from './components/CourseEnrollmentCards';
import EnrolledStudentsList from './components/EnrolledStudentsList';
import StudentForm from './components/StudentForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Toast, { type ToastTone } from '../components/Toast';
import type {
  CourseEnrollment,
  EnrollmentStatus,
  StatusHistoryEntry,
  Student,
  StudentFormData,
} from '@/types/enrollment';

const formatDateInput = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
};

const createEmptyForm = (): StudentFormData => ({
  fullName: '',
  email: '',
  enrollmentDate: new Date().toISOString().split('T')[0],
  currentStatus: 'active',
});

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `student-${Math.random().toString(36).slice(2, 10)}`;
};

type FormErrors = Partial<Record<keyof StudentFormData | 'generic', string>>;
type StatusHistoryMap = Record<string, StatusHistoryEntry[]>;

type ToastState = { message: string; tone: ToastTone; actionLabel?: string; onAction?: () => void } | null;

interface UndoStatusChange {
  studentId: string;
  previousStatus: EnrollmentStatus;
  previousHistory: StatusHistoryEntry[];
  previousCompletionDate?: Date;
}

interface UndoState {
  students: UndoStatusChange[];
  courseIds: string[];
}

const initialCourses: CourseEnrollment[] = [
  {
    courseId: 'course-1',
    courseName: 'Full-Stack Web Development',
    totalEnrolled: 3,
    activeStudents: 2,
    completedStudents: 1,
    droppedStudents: 0,
    enrollmentTrend: 'increasing',
  },
  {
    courseId: 'course-2',
    courseName: 'Data Science Foundations',
    totalEnrolled: 2,
    activeStudents: 1,
    completedStudents: 0,
    droppedStudents: 1,
    enrollmentTrend: 'stable',
  },
];

const initialStudents: Student[] = [
  {
    id: 'student-1',
    fullName: 'Amelia West',
    email: 'amelia.west@example.com',
    enrollmentDate: new Date('2024-01-05T08:00:00Z'),
    currentStatus: 'active',
    courseId: 'course-1',
    courseName: 'Full-Stack Web Development',
    progressPercentage: 72,
    lastActivity: new Date('2024-05-12T10:30:00Z'),
    statusHistory: [
      {
        status: 'active',
        timestamp: '2024-01-05T08:00:00Z',
        note: 'Enrolled via admin dashboard',
      },
    ],
  },
  {
    id: 'student-2',
    fullName: 'Marcus Lopez',
    email: 'marcus.lopez@example.com',
    enrollmentDate: new Date('2024-02-19T09:00:00Z'),
    currentStatus: 'active',
    courseId: 'course-1',
    courseName: 'Full-Stack Web Development',
    progressPercentage: 38,
    lastActivity: new Date('2024-05-10T14:15:00Z'),
    statusHistory: [
      {
        status: 'active',
        timestamp: '2024-02-19T09:00:00Z',
        note: 'Transferred from cohort 2023',
      },
    ],
  },
  {
    id: 'student-3',
    fullName: 'Priya Natarajan',
    email: 'priya.natarajan@example.com',
    enrollmentDate: new Date('2023-10-01T08:00:00Z'),
    currentStatus: 'completed',
    courseId: 'course-1',
    courseName: 'Full-Stack Web Development',
    progressPercentage: 100,
    lastActivity: new Date('2024-03-22T16:00:00Z'),
    completionDate: new Date('2024-03-20T12:00:00Z'),
    statusHistory: [
      {
        status: 'active',
        timestamp: '2023-10-01T08:00:00Z',
      },
      {
        status: 'completed',
        timestamp: '2024-03-20T12:00:00Z',
        note: 'Completed capstone project',
      },
    ],
  },
  {
    id: 'student-4',
    fullName: 'Svenja Krüger',
    email: 'svenja.kruger@example.com',
    enrollmentDate: new Date('2024-01-12T08:00:00Z'),
    currentStatus: 'active',
    courseId: 'course-2',
    courseName: 'Data Science Foundations',
    progressPercentage: 54,
    lastActivity: new Date('2024-05-08T12:45:00Z'),
    statusHistory: [
      {
        status: 'active',
        timestamp: '2024-01-12T08:00:00Z',
      },
    ],
  },
  {
    id: 'student-5',
    fullName: 'Isaiah Woods',
    email: 'isaiah.woods@example.com',
    enrollmentDate: new Date('2023-11-02T08:00:00Z'),
    currentStatus: 'dropped',
    courseId: 'course-2',
    courseName: 'Data Science Foundations',
    progressPercentage: 12,
    lastActivity: new Date('2024-01-28T09:30:00Z'),
    dropReason: 'Changed career focus',
    statusHistory: [
      {
        status: 'active',
        timestamp: '2023-11-02T08:00:00Z',
      },
      {
        status: 'dropped',
        timestamp: '2024-02-15T10:00:00Z',
        note: 'Withdrew after one-on-one session',
      },
    ],
  },
];

const buildStatusHistoryMap = (seed: Student[]): StatusHistoryMap => {
  return seed.reduce<StatusHistoryMap>((acc, student) => {
    if (student.statusHistory && student.statusHistory.length > 0) {
      acc[student.id] = student.statusHistory;
    }
    return acc;
  }, {});
};

export default function StudentEnrollmentPage() {
  const [courses, setCourses] = useState<CourseEnrollment[]>(initialCourses);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [statusHistoryMap, setStatusHistoryMap] = useState<StatusHistoryMap>(() => buildStatusHistoryMap(initialStudents));
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourses[0]?.courseId ?? '');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<StudentFormData>(() => {
    const firstForCourse = initialStudents.find((student) => student.courseId === initialCourses[0]?.courseId);
    return firstForCourse
      ? {
          fullName: firstForCourse.fullName,
          email: firstForCourse.email,
          enrollmentDate: formatDateInput(firstForCourse.enrollmentDate),
          currentStatus: firstForCourse.currentStatus,
        }
      : createEmptyForm();
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<EnrollmentStatus>('active');
  const [toast, setToast] = useState<ToastState>(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.courseId === selectedCourseId) ?? courses[0],
    [courses, selectedCourseId],
  );

  const filteredStudents = useMemo(
    () => students.filter((student) => student.courseId === selectedCourse?.courseId),
    [students, selectedCourse?.courseId],
  );

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [students, selectedStudentId],
  );

  const statusHistoryForStudent = selectedStudentId ? statusHistoryMap[selectedStudentId] ?? [] : [];

  useEffect(() => {
    if (!selectedCourse) {
      return;
    }

    if (!selectedStudentId || !filteredStudents.some((student) => student.id === selectedStudentId)) {
      setSelectedStudentId(filteredStudents[0]?.id ?? null);
    }

    setSelectedStudentIds((previous) => previous.filter((id) => filteredStudents.some((student) => student.id === id)));
  }, [filteredStudents, selectedCourse, selectedStudentId]);

  useEffect(() => {
    if (!selectedStudent) {
      setFormData(createEmptyForm());
      return;
    }

    setFormData({
      fullName: selectedStudent.fullName,
      email: selectedStudent.email,
      enrollmentDate: formatDateInput(selectedStudent.enrollmentDate),
      currentStatus: selectedStudent.currentStatus,
    });
    setFormErrors({});
  }, [selectedStudent]);

  const validateForm = (data: StudentFormData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!data.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'Enter a valid email address.';
      }
    }

    const otherStudent = students.find(
      (student) => student.email.toLowerCase() === data.email.toLowerCase() && student.id !== selectedStudentId,
    );
    if (otherStudent) {
      errors.email = 'A student with this email already exists in the system.';
    }

    if (!data.enrollmentDate) {
      errors.enrollmentDate = 'Enrollment date is required.';
    } else {
      const date = new Date(data.enrollmentDate);
      const now = new Date();
      if (Number.isNaN(date.getTime())) {
        errors.enrollmentDate = 'Enter a valid enrollment date.';
      } else if (date > now) {
        errors.enrollmentDate = 'Enrollment date cannot be in the future.';
      }
    }

    if (!data.currentStatus) {
      errors.currentStatus = 'Select the current enrollment status.';
    }

    return errors;
  };

  const recalculateCourseMetrics = (courseId: string, updatedStudents: Student[]) => {
    setCourses((previous) =>
      previous.map((course) => {
        if (course.courseId !== courseId) {
          return course;
        }
        const courseStudents = updatedStudents.filter((student) => student.courseId === courseId);
        const activeStudents = courseStudents.filter((student) => student.currentStatus === 'active').length;
        const completedStudents = courseStudents.filter((student) => student.currentStatus === 'completed').length;
        const droppedStudents = courseStudents.filter((student) => student.currentStatus === 'dropped').length;
        const totalEnrolled = courseStudents.length;
        const difference = totalEnrolled - course.totalEnrolled;
        const enrollmentTrend =
          difference > 0 ? 'increasing' : difference < 0 ? 'decreasing' : course.enrollmentTrend;

        return {
          ...course,
          totalEnrolled,
          activeStudents,
          completedStudents,
          droppedStudents,
          enrollmentTrend,
        };
      }),
    );
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedStudentId(null);
    setSelectedStudentIds([]);
  };

  const handleFormChange = <Key extends keyof StudentFormData>(field: Key, value: StudentFormData[Key]) => {
    if (field === 'currentStatus' && selectedStudent) {
      const nextStatus = value as EnrollmentStatus;
      const existingStatus = selectedStudent.currentStatus;
      if (existingStatus !== 'active' && nextStatus !== existingStatus) {
        setToast({
          message: 'Only active students can transition to a different status without support approval.',
          tone: 'error',
        });
        setFormErrors((previous) => ({ ...previous, generic: 'Status change not permitted for this record.' }));
        return;
      }
    }

    setFormData((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: undefined, generic: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    setUndoState(null);

    const nextStudents = [...students];
    const normalizedDate = new Date(formData.enrollmentDate);
    let nextUndoState: UndoState | null = null;
    let toastMessage = 'Student record saved successfully.';
    let toastTone: ToastTone = 'success';

    if (selectedStudent) {
      const index = nextStudents.findIndex((student) => student.id === selectedStudent.id);
      if (index !== -1) {
        const existing = nextStudents[index];
        const statusChanged = existing.currentStatus !== formData.currentStatus;
        let nextStatus: EnrollmentStatus = formData.currentStatus;
        if (existing.progressPercentage && existing.progressPercentage >= 100) {
          nextStatus = 'completed';
        }

        const previousHistory = statusHistoryMap[existing.id] ?? [];
        const shouldRecordHistory = statusChanged || existing.currentStatus !== nextStatus;
        const newHistoryEntry: StatusHistoryEntry | null = shouldRecordHistory
          ? {
              status: nextStatus,
              timestamp: new Date().toISOString(),
              note: statusChanged ? `Status changed from ${existing.currentStatus} to ${nextStatus}.` : undefined,
            }
          : null;
        const updatedHistory = newHistoryEntry ? [...previousHistory, newHistoryEntry] : previousHistory;

        const updatedStudent: Student = {
          ...existing,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          enrollmentDate: normalizedDate,
          currentStatus: nextStatus,
          completionDate: nextStatus === 'completed' ? existing.completionDate ?? new Date() : existing.completionDate,
          statusHistory: updatedHistory,
        };

        nextStudents[index] = updatedStudent;

        if (newHistoryEntry) {
          setStatusHistoryMap((previous) => ({
            ...previous,
            [existing.id]: updatedHistory,
          }));
          nextUndoState = {
            students: [
              {
                studentId: existing.id,
                previousStatus: existing.currentStatus,
                previousHistory,
                previousCompletionDate: existing.completionDate,
              },
            ],
            courseIds: [existing.courseId],
          };
          toastMessage = 'Enrollment status updated successfully.';
        }

        recalculateCourseMetrics(existing.courseId, nextStudents);
      }
    } else if (selectedCourse) {
      const id = generateId();
      const creationEntry: StatusHistoryEntry = {
        status: formData.currentStatus,
        timestamp: new Date().toISOString(),
        note: 'Student record created from dashboard',
      };
      const newStudent: Student = {
        id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        enrollmentDate: normalizedDate,
        currentStatus: formData.currentStatus,
        courseId: selectedCourse.courseId,
        courseName: selectedCourse.courseName,
        progressPercentage: 0,
        lastActivity: new Date(),
        statusHistory: [creationEntry],
      };
      nextStudents.push(newStudent);
      setStatusHistoryMap((previous) => ({ ...previous, [id]: newStudent.statusHistory ?? [] }));
      setSelectedStudentId(id);
      setSelectedStudentIds([]);
      recalculateCourseMetrics(selectedCourse.courseId, nextStudents);
      toastMessage = 'New student added to the course.';
    }

    setStudents(nextStudents);
    if (nextUndoState) {
      setUndoState(nextUndoState);
      setToast({ message: toastMessage, tone: toastTone, actionLabel: 'Undo', onAction: handleUndoStatusChange });
    } else {
      setToast({ message: toastMessage, tone: toastTone });
    }
    setIsSaving(false);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) {
      return;
    }
    const studentToRemove = students.find((student) => student.id === pendingDeleteId);
    if (!studentToRemove) {
      setPendingDeleteId(null);
      return;
    }
    setIsDeleting(true);

    const updatedStudents = students.filter((student) => student.id !== pendingDeleteId);
    const { [pendingDeleteId]: _removed, ...nextHistory } = statusHistoryMap;
    setStudents(updatedStudents);
    setStatusHistoryMap(nextHistory);
    recalculateCourseMetrics(studentToRemove.courseId, updatedStudents);

    setSelectedStudentIds((previous) => previous.filter((id) => id !== pendingDeleteId));
    setPendingDeleteId(null);
    setSelectedStudentId((previous) => (previous === pendingDeleteId ? null : previous));
    setFormData(createEmptyForm());
    setUndoState(null);
    setToast({ message: 'Student record deleted.', tone: 'info' });
    setIsDeleting(false);
  };

  const handleDelete = () => {
    if (!selectedStudent) {
      setFormErrors((previous) => ({ ...previous, generic: 'Select a student record before attempting to delete.' }));
      return;
    }
    setPendingDeleteId(selectedStudent.id);
  };

  const handleReset = () => {
    setSelectedStudentId(null);
    setFormData(createEmptyForm());
    setFormErrors({});
  };

  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((previous) =>
      previous.includes(studentId) ? previous.filter((id) => id !== studentId) : [...previous, studentId],
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedStudentIds((previous) => {
      if (filteredStudents.length === 0) {
        return [];
      }
      if (previous.length === filteredStudents.length) {
        return [];
      }
      return filteredStudents.map((student) => student.id);
    });
  };

  const handleUndoStatusChange = () => {
    if (!undoState) {
      return;
    }

    const restoredStudents = students.map((student) => {
      const undoRecord = undoState.students.find((entry) => entry.studentId === student.id);
      if (!undoRecord) {
        return student;
      }
      return {
        ...student,
        currentStatus: undoRecord.previousStatus,
        statusHistory: undoRecord.previousHistory,
        completionDate: undoRecord.previousCompletionDate,
      };
    });

    setStudents(restoredStudents);
    setStatusHistoryMap((previous) => {
      const next = { ...previous };
      undoState.students.forEach((entry) => {
        next[entry.studentId] = entry.previousHistory;
      });
      return next;
    });

    undoState.courseIds.forEach((courseId) => {
      recalculateCourseMetrics(courseId, restoredStudents);
    });

    setUndoState(null);
    setToast({ message: 'Recent status update has been reverted.', tone: 'info' });
  };

  const handleBulkEmail = (ids: string[]) => {
    if (ids.length === 0) {
      setToast({ message: 'Select at least one student before sending notifications.', tone: 'error' });
      return;
    }
    setToast({ message: `Email notifications queued for ${ids.length} students.`, tone: 'info' });
  };

  const handleExport = (ids: string[]) => {
    if (ids.length === 0) {
      setToast({ message: 'Choose students to include in the export report.', tone: 'error' });
      return;
    }
    setToast({ message: `Exporting enrollment report for ${ids.length} students.`, tone: 'success' });
  };

  const handleTransfer = (ids: string[]) => {
    if (ids.length === 0) {
      setToast({ message: 'Select students to transfer to a different course.', tone: 'error' });
      return;
    }
    setToast({ message: `Transfer workflow started for ${ids.length} students.`, tone: 'info' });
  };

  const handleApplyBulkStatus = () => {
    if (selectedStudentIds.length === 0) {
      setFormErrors((previous) => ({ ...previous, generic: 'Select at least one student to apply a bulk status update.' }));
      return;
    }

    setUndoState(null);
    const historyUpdates: Record<string, StatusHistoryEntry> = {};
    const undoRecords: UndoStatusChange[] = [];
    const updatedStudents = students.map((student) => {
      if (!selectedStudentIds.includes(student.id)) {
        return student;
      }
      if (student.currentStatus !== 'active' && student.currentStatus !== bulkStatus) {
        return student;
      }
      if (student.currentStatus === bulkStatus) {
        return student;
      }

      const historyEntry: StatusHistoryEntry = {
        status: bulkStatus,
        timestamp: new Date().toISOString(),
        note: 'Bulk status update applied.',
      };

      historyUpdates[student.id] = historyEntry;

      const previousHistory = statusHistoryMap[student.id] ?? [];
      const nextHistory = [...previousHistory, historyEntry];
      undoRecords.push({
        studentId: student.id,
        previousStatus: student.currentStatus,
        previousHistory,
        previousCompletionDate: student.completionDate,
      });

      return {
        ...student,
        currentStatus: bulkStatus,
        completionDate: bulkStatus === 'completed' ? new Date() : student.completionDate,
        statusHistory: nextHistory,
      };
    });

    const affectedCourseIds = new Set(selectedStudentIds.map((id) => students.find((student) => student.id === id)?.courseId));
    affectedCourseIds.forEach((courseId) => {
      if (!courseId) return;
      recalculateCourseMetrics(courseId, updatedStudents);
    });

    if (Object.keys(historyUpdates).length > 0) {
      setStatusHistoryMap((previous) => {
        const next = { ...previous };
        Object.entries(historyUpdates).forEach(([id, entry]) => {
          next[id] = [...(next[id] ?? []), entry];
        });
        return next;
      });
    }

    setStudents(updatedStudents);
    if (undoRecords.length > 0) {
      setUndoState({
        students: undoRecords,
        courseIds: Array.from(affectedCourseIds).filter((value): value is string => Boolean(value)),
      });
      setToast({ message: 'Bulk status update complete.', tone: 'success', actionLabel: 'Undo', onAction: handleUndoStatusChange });
    } else {
      setToast({ message: 'No status changes were applied. Verify selected students are eligible.', tone: 'info' });
    }
  };

  const disabledStatuses = selectedStudent && selectedStudent.currentStatus !== 'active'
    ? (['active', 'completed', 'dropped'] as EnrollmentStatus[]).filter((status) => status !== selectedStudent.currentStatus)
    : [];

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-10 lg:px-8">
        <AdminSidebar className="hidden lg:flex" activePath="/admin/students" />
        <main className="flex-1 rounded-2xl bg-[#F3F3F3] p-6 lg:bg-white/50 lg:p-10">
          <header className="flex flex-col gap-3 border-b border-slate-200 pb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#33A1CD]">Enrollment Management</p>
            <h1 className="text-3xl font-bold text-slate-900">Student Enrollment Details</h1>
            <p className="max-w-3xl text-sm text-slate-600">
              Monitor course capacity, track learner progress, and maintain accurate student records with real-time validation
              and visual enrollment insights.
            </p>
          </header>

          <div className="mt-8 grid gap-8">
            <CourseEnrollmentCards
              courses={courses}
              selectedCourseId={selectedCourse?.courseId ?? ''}
              onSelectCourse={handleSelectCourse}
              onViewStudents={handleSelectCourse}
            />

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <StudentForm
                formData={formData}
                errors={formErrors}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onReset={handleReset}
                onBulkStatusChange={setBulkStatus}
                onApplyBulkStatus={handleApplyBulkStatus}
                bulkStatus={bulkStatus}
                selectedStudentCount={selectedStudentIds.length}
                isEditing={Boolean(selectedStudent)}
                statusHistory={statusHistoryForStudent}
                disabledStatuses={disabledStatuses}
                disableSave={isSaving}
                disableDelete={!selectedStudent || isDeleting}
                isSaving={isSaving}
                isDeleting={isDeleting}
              />

              <EnrolledStudentsList
                students={filteredStudents}
                selectedStudentId={selectedStudentId}
                selectedStudentIds={selectedStudentIds}
                onSelectStudent={setSelectedStudentId}
                onToggleStudentSelection={handleToggleStudentSelection}
                onToggleSelectAll={handleToggleSelectAll}
                onBulkEmail={handleBulkEmail}
                onExport={handleExport}
                onTransfer={handleTransfer}
              />
            </div>
          </div>
        </main>
      </div>

      <ConfirmationDialog
        open={Boolean(pendingDeleteId)}
        title="Delete student record?"
        description="This action will remove the student from the course enrollment list. Progress data will be retained for reporting purposes."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      {toast && (
        <Toast
          tone={toast.tone}
          message={toast.message}
          onDismiss={() => setToast(null)}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
        />
      )}
    </div>
  );
}
