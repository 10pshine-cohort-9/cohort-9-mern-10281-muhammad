import { useEffect, useRef, type ReactElement } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  setIsOpen,
  title = "Delete note?",
  message = "Are you sure you want to delete this note? This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
  onConfirm,
}: Props): ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!loading) {
          setIsOpen(false);
        }
        return;
      }

      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setIsOpen, loading]);

  useEffect(() => {
    if (!isOpen && previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
      previouslyFocusedElement.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => {
      const confirmButton = modalRef.current?.querySelector<HTMLButtonElement>(
        '[data-confirm-button="true"]',
      );

      confirmButton?.focus();
    }, 0);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
      className="
        fixed inset-0 z-50
        flex items-start justify-center
        pt-24
        bg-black/30
        backdrop-blur-sm
      "
      onClick={() => {
        if (!loading) {
          setIsOpen(false);
        }
      }}
    >
      <div
        ref={modalRef}
        className="
          w-full max-w-md
          bg-white
          rounded-xl
          border border-gray-300
          shadow-lg
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* CONTENT */}
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
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-300">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="
              px-3 py-1.5
              text-sm
              text-gray-600
              border border-gray-300
              rounded-md
              hover:bg-gray-50
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            data-confirm-button="true"
            onClick={onConfirm}
            disabled={loading}
            className="
              px-3 py-1.5
              text-sm
              text-white
              bg-red-600
              rounded-md
              hover:bg-red-700
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
