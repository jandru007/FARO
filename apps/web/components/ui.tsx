import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`focus-ring faro-black-button inline-flex h-12 items-center justify-center rounded-[10px] px-5 text-sm font-semibold text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`focus-ring h-12 w-full rounded-lg border border-faro-border bg-white px-4 text-base text-faro-ink placeholder:text-[#A1A1AA] ${className}`}
      {...props}
    />
  );
}
