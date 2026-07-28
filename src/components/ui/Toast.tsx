"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext<(text: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState<string | null>(null);

  const showToast = useCallback((t: string) => {
    setText(t);
    window.setTimeout(() => setText(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {text && (
        <div className="fixed md:absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pio-toast">
          <div className="bg-pio-ink text-white px-4.5 py-2.5 rounded-full text-[12.5px] font-semibold shadow-lg whitespace-nowrap">
            {text}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
