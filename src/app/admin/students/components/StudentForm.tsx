'use client';

import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import type { FormEvent } from 'react';
import type { StudentFormData, StatusHistoryEntry, EnrollmentStatus } from '@/types/enrollment';
import StatusSelector from './StatusSelector';
import StudentActions from './StudentActions';

interface StudentFormProps {
  formData: StudentFormData;
  errors: Partial<Record<keyof StudentFormData | 'generic', string>>;
  onChange: <Key extends keyof StudentFormData>(field: Key, value: StudentFormData[Key]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  onReset: () => void;
  onBulkStatusChange: (status: EnrollmentStatus) => void;
  onApplyBulkStatus: () => void;
  bulkStatus: EnrollmentStatus;
  selectedStudentCount: number;
  isEditing: boolean;
  statusHistory: StatusHistoryEntry[];
  disabledStatuses?: EnrollmentStatus[];
  disableSave?: boolean;
  disableDelete?: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function StudentForm({
  formData,
  errors,
  onChange,
  onSubmit,
  onDelete,
  onReset,
  onBulkStatusChange,
  onApplyBulkStatus,
  bulkStatus,
  selectedStudentCount,
  isEditing,
  statusHistory,
  disabledStatuses = [],
  disableSave,
  disableDelete,
  isSaving,
  isDeleting,
}: StudentFormProps) {
  return (
    <section aria-label="Student information" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={onSubmit} noValidate>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Student Information</h2>
            <p className="mt-1 text-sm text-slate-600">
              Update enrollment details, track progress, and manage communication preferences from a single location.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-semibold text-slate-800">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={(event) => onChange('fullName', event.target.value)}
                className={clsx(
                  'rounded-xl border border-slate-200 bg-[#BDD0D2]/60 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-[#33A1CD] focus:outline-none focus:ring-2 focus:ring-[#33A1CD] focus:ring-offset-1',
                  errors.fullName && 'border-rose-300 ring-rose-200',
                )}
                placeholder="Jane Doe"
                required
              />
              {errors.fullName && (
                <p className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(event) => onChange('email', event.target.value)}
                className={clsx(
                  'rounded-xl border border-slate-200 bg-[#BDD0D2]/60 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-[#33A1CD] focus:outline-none focus:ring-2 focus:ring-[#33A1CD] focus:ring-offset-1',
                  errors.email && 'border-rose-300 ring-rose-200',
                )}
                placeholder="jane.doe@email.com"
                required
              />
              {errors.email && (
                <p className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="enrollmentDate" className="text-sm font-semibold text-slate-800">
                Enrollment Date
              </label>
              <input
                id="enrollmentDate"
                name="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(event) => onChange('enrollmentDate', event.target.value)}
                className={clsx(
                  'rounded-xl border border-slate-200 bg-[#BDD0D2]/60 px-4 py-3 text-base text-slate-900 shadow-inner focus:border-[#33A1CD] focus:outline-none focus:ring-2 focus:ring-[#33A1CD] focus:ring-offset-1',
                  errors.enrollmentDate && 'border-rose-300 ring-rose-200',
                )}
                required
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.enrollmentDate && (
                <p className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.enrollmentDate}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-semibold text-slate-800">
                Current Status
              </label>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <StatusSelector
                  name="studentStatus"
                  value={formData.currentStatus}
                  onChange={(status) => onChange('currentStatus', status)}
                  disabledStatuses={disabledStatuses}
                />
              </div>
              {errors.currentStatus && (
                <p className="flex items-center gap-1 text-sm text-rose-600">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {errors.currentStatus}
                </p>
              )}
            </div>
          </div>

          {statusHistory.length > 0 && (
            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Status History</h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-700">
                {statusHistory.map((entry) => (
                  <li key={`${entry.status}-${entry.timestamp}`} className="flex items-start gap-3 rounded-lg bg-white/70 p-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#33A1CD]" aria-hidden="true" />
                    <div>
                      <p className="font-semibold capitalize text-slate-900">{entry.status}</p>
                      <p>{new Date(entry.timestamp).toLocaleString()}</p>
                      {entry.note && <p className="text-slate-500">{entry.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <StudentActions
          isEditing={isEditing}
          disableSave={disableSave}
          disableDelete={disableDelete}
          onDelete={onDelete}
          onReset={onReset}
          selectedStudentCount={selectedStudentCount}
          bulkStatus={bulkStatus}
          onBulkStatusChange={onBulkStatusChange}
          onApplyBulkStatus={onApplyBulkStatus}
          isBulkActionDisabled={isSaving || isDeleting}
          isSaving={isSaving}
          isDeleting={isDeleting}
        />
        {errors.generic && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-rose-600">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {errors.generic}
          </p>
        )}
      </form>
    </section>
  );
}

export default StudentForm;
