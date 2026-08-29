import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
