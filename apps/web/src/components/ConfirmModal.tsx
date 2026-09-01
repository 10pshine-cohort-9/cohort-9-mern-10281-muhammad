import { useEffect, useRef, type ReactElement } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  setIsOpen,
  title = "Delete note?",
  message = "Are you sure you want to delete this note? This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
  error = null,
  onConfirm,
}: Props): ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    confirmButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!loading) setIsOpen(false);
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, setIsOpen]);

  useEffect(() => {
    if (isOpen || !previousFocusRef.current) return;

    previousFocusRef.current.focus();
    previousFocusRef.current = null;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30 backdrop-blur-sm"
      onClick={() => !loading && setIsOpen(false)}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl border border-gray-300 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-4">
          <h2
            id="confirm-modal-title"
            className="text-sm font-semibold text-gray-900"
          >
            {title}
          </h2>

          <p id="confirm-modal-message" className="text-sm text-gray-500 mt-1">
            {message}
          </p>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 mt-3"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-300">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
