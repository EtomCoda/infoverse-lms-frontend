import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, errorMessage, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-black/20 bg-[#bdd0d2] px-4 py-3 text-base text-black placeholder:text-black/50 focus:border-[#33a1cd] focus:outline-none focus:ring-2 focus:ring-[#33a1cd] disabled:cursor-not-allowed disabled:opacity-50",
        errorMessage && "border-red-500 focus:border-red-500 focus:ring-red-500",
        className,
      )}
      aria-invalid={Boolean(errorMessage)}
      aria-describedby={errorMessage ? `${props.id ?? props.name}-error` : props["aria-describedby"]}
      {...props}
    />
  );
});
