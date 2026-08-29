import React from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const Toast = ({ message, type }: ToastProps) => {
  const bgColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
    info: "bg-blue-600",
  }[type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded shadow-lg mb-2 animate-slide-in`}
    >
      {message}
    </div>
  );
};

export default Toast;