'use client';

import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { SecurityAlertVariant } from '../../types/security';

interface SecurityAlertProps {
  variant?: SecurityAlertVariant;
  title: string;
  description?: string;
  action?: ReactNode;
  onDismiss?: () => void;
}

const variantStyles: Record<SecurityAlertVariant, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-red-200 bg-red-50 text-red-900',
};

const variantIcons: Record<SecurityAlertVariant, ReactNode> = {
  info: <Info className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />, 
  success: <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />, 
  warning: <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />, 
  error: <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />, 
};

export const SecurityAlert = ({
  variant = 'info',
  title,
  description,
  action,
  onDismiss,
}: SecurityAlertProps) => (
  <div className={clsx('flex items-start gap-3 rounded-2xl border p-4 shadow-sm', variantStyles[variant])} role="status">
    {variantIcons[variant]}
    <div className="flex-1 space-y-1 text-sm">
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm opacity-90">{description}</p>}
      {action && <div className="pt-2 text-sm">{action}</div>}
    </div>
    {onDismiss && (
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-full p-2 text-xs font-medium uppercase tracking-wide text-current transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        Dismiss
      </button>
    )}
  </div>
);
