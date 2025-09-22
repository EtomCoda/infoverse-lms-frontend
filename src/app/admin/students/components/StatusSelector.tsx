'use client';

import { CheckCircle2, GraduationCap, XCircle } from 'lucide-react';
import clsx from 'clsx';
import type { EnrollmentStatus } from '@/types/enrollment';

interface StatusOption {
  value: EnrollmentStatus;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  indicator: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'active',
    label: 'Active',
    description: 'Student is currently progressing through the course.',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    indicator: 'bg-emerald-500',
  },
  {
    value: 'completed',
    label: 'Completed',
    description: 'Course finished and certificate ready to generate.',
    icon: GraduationCap,
    color: 'text-sky-600',
    indicator: 'bg-sky-500',
  },
  {
    value: 'dropped',
    label: 'Dropped',
    description: 'Student withdrew or became inactive.',
    icon: XCircle,
    color: 'text-rose-600',
    indicator: 'bg-rose-500',
  },
];

interface StatusSelectorProps {
  value: EnrollmentStatus;
  onChange: (status: EnrollmentStatus) => void;
  disabledStatuses?: EnrollmentStatus[];
  className?: string;
  legend?: string;
  name?: string;
}

export function StatusSelector({
  value,
  onChange,
  disabledStatuses = [],
  className,
  legend = 'Current Status',
  name = 'currentStatus',
}: StatusSelectorProps) {
  return (
    <fieldset className={clsx('space-y-4', className)}>
      <legend className="text-lg font-semibold text-slate-900">{legend}</legend>
      <div className="grid gap-3 md:grid-cols-3">
        {STATUS_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const isDisabled = disabledStatuses.includes(option.value);

          return (
            <label
              key={option.value}
              className={clsx(
                'flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#33A1CD]',
                isSelected && 'border-[#33A1CD] shadow-md',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className={clsx('mt-0.5 flex h-3 w-3 items-center justify-center rounded-full', option.indicator)}>
                <span className="sr-only">{option.label} status</span>
              </span>
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <option.icon className={clsx('h-5 w-5', option.color)} aria-hidden="true" />
                  {option.label}
                </div>
                <p className="mt-1 text-sm text-slate-600">{option.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default StatusSelector;
