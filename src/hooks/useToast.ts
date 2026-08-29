import { useState, useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

export const useToast = () => {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: ToastType }[]
  >([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // desaparece em 4s
  }, []);

  return { toasts, addToast };
};