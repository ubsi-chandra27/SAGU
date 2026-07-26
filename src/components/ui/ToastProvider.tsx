"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import styles from "./ToastProvider.module.css";

type ToastTone = "danger" | "info" | "success" | "warning";

type ToastInput = {
  description?: string;
  title: string;
  tone?: ToastTone;
};

type ToastItem = ToastInput & {
  id: number;
  tone: ToastTone;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ description, title, tone = "info" }: ToastInput) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((current) => [
        ...current.slice(-3),
        { description, id, title, tone },
      ]);
      window.setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-relevant="additions" className={styles.viewport}>
        {toasts.map((toast) => (
          <div className={`${styles.toast} ${styles[toast.tone]}`} key={toast.id}>
            <span className={styles.icon} aria-hidden="true">
              {toast.tone === "success" ? "✓" : toast.tone === "danger" ? "!" : "i"}
            </span>
            <div className={styles.content}>
              <strong className={styles.title}>{toast.title}</strong>
              {toast.description ? (
                <p className={styles.description}>{toast.description}</p>
              ) : null}
            </div>
            <button
              aria-label="Tutup notifikasi"
              className={styles.close}
              onClick={() => dismissToast(toast.id)}
              type="button"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus dipakai di dalam ToastProvider");
  }
  return context;
}
