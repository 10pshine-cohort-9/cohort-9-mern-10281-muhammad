import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type Props = {
  label?: string;
  registration: UseFormRegisterReturn;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormField({
  label,
  registration,
  error,
  className,
  ...props
}: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={registration.name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        {...registration}
        id={registration.name}
        className={twMerge(
          "w-full px-3 py-2 border rounded-md text-sm outline-none transition",
          error
            ? "border-red-400 focus:ring-red-200 focus:ring-2"
            : "border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black",
          className,
        )}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
