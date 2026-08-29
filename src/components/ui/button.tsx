import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 cursor-pointer transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

