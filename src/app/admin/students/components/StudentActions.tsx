'use client';

import clsx from 'clsx';
import { RefreshCcw } from 'lucide-react';
import type { EnrollmentStatus } from '@/types/enrollment';
import StatusSelector from './StatusSelector';

interface StudentActionsProps {
  isEditing: boolean;
  disableSave?: boolean;
  disableDelete?: boolean;
  onDelete: () => void;
  onReset: () => void;
  selectedStudentCount: number;
  bulkStatus: EnrollmentStatus;
  onBulkStatusChange: (status: EnrollmentStatus) => void;
  onApplyBulkStatus: () => void;
  isBulkActionDisabled?: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function StudentActions({
  isEditing,
  disableSave,
  disableDelete,
  onDelete,
  onReset,
  selectedStudentCount,
  bulkStatus,
  onBulkStatusChange,
  onApplyBulkStatus,
  isBulkActionDisabled,
  isSaving,
  isDeleting,
}: StudentActionsProps) {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Bulk Status Update</h3>
          <p className="text-sm text-slate-600">
            Apply a new enrollment status to the selected students. Use this to graduate active cohorts or manage drop-outs
            efficiently.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-end">
          <StatusSelector
            legend="Bulk status"
            name="bulkStatus"
            value={bulkStatus}
            onChange={onBulkStatusChange}
            className="md:max-w-md"
          />
          <button
            type="button"
            onClick={onApplyBulkStatus}
            disabled={isBulkActionDisabled || selectedStudentCount === 0}
            className={clsx(
              'inline-flex items-center justify-center rounded-xl bg-[#33A1CD] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#33A1CD] focus-visible:ring-offset-2',
              (isBulkActionDisabled || selectedStudentCount === 0) && 'cursor-not-allowed opacity-60',
            )}
          >
            Update {selectedStudentCount > 0 ? `${selectedStudentCount} Students` : 'Students'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Reset Form
        </button>
        <div className="flex flex-col gap-3 md:flex-row">
          <button
            type="button"
            onClick={onDelete}
            disabled={disableDelete}
            className={clsx(
              'rounded-xl bg-white px-6 py-3 text-sm font-semibold text-rose-600 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400',
              disableDelete && 'cursor-not-allowed opacity-60',
            )}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
          <button
            type="submit"
            disabled={disableSave}
            className={clsx(
              'rounded-xl bg-[#DD7C5E] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#c66a51] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#33A1CD] focus-visible:ring-offset-2',
              disableSave && 'cursor-not-allowed opacity-60',
            )}
          >
            {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentActions;
