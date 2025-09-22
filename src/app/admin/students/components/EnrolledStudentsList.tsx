'use client';

import { useMemo } from 'react';
import { Mail, Users, FileDown, ArrowRightLeft } from 'lucide-react';
import clsx from 'clsx';
import StatusBadge from './StatusBadge';
import type { Student } from '@/types/enrollment';

interface EnrolledStudentsListProps {
  students: Student[];
  selectedStudentId: string | null;
  selectedStudentIds: string[];
  onSelectStudent: (studentId: string) => void;
  onToggleStudentSelection: (studentId: string) => void;
  onToggleSelectAll: () => void;
  onBulkEmail?: (studentIds: string[]) => void;
  onExport?: (studentIds: string[]) => void;
  onTransfer?: (studentIds: string[]) => void;
}

export function EnrolledStudentsList({
  students,
  selectedStudentId,
  selectedStudentIds,
  onSelectStudent,
  onToggleStudentSelection,
  onToggleSelectAll,
  onBulkEmail,
  onExport,
  onTransfer,
}: EnrolledStudentsListProps) {
  const allSelected = useMemo(
    () => students.length > 0 && selectedStudentIds.length === students.length,
    [selectedStudentIds.length, students.length],
  );

  return (
    <section aria-label="Enrolled students" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Enrolled Students</h2>
          <p className="text-sm text-slate-600">
            Manage individual student records, send communications, and export course enrollment data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onBulkEmail?.(selectedStudentIds)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Bulk Email
          </button>
          <button
            type="button"
            onClick={() => onExport?.(selectedStudentIds)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            Export
          </button>
          <button
            type="button"
            onClick={() => onTransfer?.(selectedStudentIds)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
            Transfer
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Select</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-[#33A1CD] focus:ring-[#33A1CD]"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    aria-label={allSelected ? 'Deselect all students' : 'Select all students'}
                  />
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Student
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Enrollment Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Progress
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {students.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                const isFocused = selectedStudentId === student.id;
                const enrollmentDate = new Date(student.enrollmentDate).toLocaleDateString();
                const lastActivity = student.lastActivity
                  ? new Date(student.lastActivity).toLocaleDateString()
                  : '—';

                return (
                  <tr
                    key={student.id}
                    className={clsx(
                      'cursor-pointer transition-colors hover:bg-slate-50',
                      isFocused && 'bg-sky-50/60',
                    )}
                    onClick={() => onSelectStudent(student.id)}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-[#33A1CD] focus:ring-[#33A1CD]"
                        checked={isSelected}
                        onChange={(event) => {
                          event.stopPropagation();
                          onToggleStudentSelection(student.id);
                        }}
                        aria-label={`Select ${student.fullName}`}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#BDD0D2]/70 text-base font-semibold text-slate-800">
                          {student.fullName
                            .split(' ')
                            .map((name) => name.charAt(0))
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{student.fullName}</p>
                          <p className="text-sm text-slate-600">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={student.currentStatus} />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{enrollmentDate}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-[#33A1CD]"
                            style={{ width: `${Math.min(100, Math.max(0, student.progressPercentage ?? 0))}%` }}
                          />
                        </div>
                        <span>{student.progressPercentage ?? 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{lastActivity}</td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                    No students enrolled for this course yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Users className="h-4 w-4" aria-hidden="true" />
          {selectedStudentIds.length} selected
        </div>
        <p>
          Tip: use the bulk actions above to send updates, export reports, or transfer students between courses.
        </p>
      </div>
    </section>
  );
}

export default EnrolledStudentsList;
