import React, { useEffect } from 'react';

export default function Toasts({ toasts = [], remove }) {
  useEffect(() => {
    if (!toasts || toasts.length === 0) return;
    const ids = toasts.map(t => t.id);
    // auto remove after 3s
    const timers = ids.map(id => setTimeout(() => remove(id), 3000));
    return () => timers.forEach(t => clearTimeout(t));
  }, [toasts, remove]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-sm text-white flex items-center justify-between ${
            t.type === 'error' ? 'bg-red-600' : t.type === 'warning' ? 'bg-yellow-600 text-black' : 'bg-green-600'
          }`}
        >
          <div className="truncate pr-3">{t.message}</div>
          <button className="ml-2 opacity-90" onClick={() => remove(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
