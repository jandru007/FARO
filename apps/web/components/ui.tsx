import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`focus-ring inline-flex h-12 items-center justify-center rounded-lg bg-faro-blue px-5 text-sm font-semibold text-white transition hover:bg-[#2846D8] disabled:cursor-not-allowed disabled:bg-[#AEB7FF] ${className}`}
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
