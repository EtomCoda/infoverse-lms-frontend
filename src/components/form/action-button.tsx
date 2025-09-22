import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: "solid" | "outline" | "ghost" | "danger";
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<NonNullable<ActionButtonProps["variant"]>, string> = {
  solid: "bg-[#dd7c5e] text-white hover:bg-[#c46b50] focus-visible:outline-[#dd7c5e]",
  danger: "bg-[#dd7c5e] text-white hover:bg-[#c46b50] focus-visible:outline-[#dd7c5e]",
  outline:
    "border border-[#dd7c5e] text-[#dd7c5e] hover:bg-[#dd7c5e]/10 focus-visible:outline-[#dd7c5e]",
  ghost: "text-[#dd7c5e] hover:bg-[#dd7c5e]/10 focus-visible:outline-[#dd7c5e]",
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { className, isLoading, loadingLabel, children, disabled, variant = "solid", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      <span>{isLoading ? loadingLabel ?? "Processing" : children}</span>
    </button>
  );
});
