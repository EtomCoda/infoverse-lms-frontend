import clsx from 'clsx';
import type { EnrollmentStatus } from '@/types/enrollment';

interface StatusBadgeProps {
  status: EnrollmentStatus;
  className?: string;
}

const statusStyles: Record<EnrollmentStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  completed: 'bg-sky-100 text-sky-700 ring-sky-200',
  dropped: 'bg-rose-100 text-rose-700 ring-rose-200',
};

const statusLabels: Record<EnrollmentStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  dropped: 'Dropped',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset transition-colors',
        statusStyles[status],
        className,
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

export default StatusBadge;
