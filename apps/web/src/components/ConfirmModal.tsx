import { X } from "lucide-react";
import type { ReactElement } from "react";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps): ReactElement | null {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="
            absolute right-4 top-4
            flex items-center justify-center
            w-8 h-8
            rounded-md
            text-gray-500
            hover:bg-gray-100
            transition
            disabled:opacity-50
          "
        >
          <X size={18} />
        </button>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="
                px-4 py-2
                text-sm
                rounded-md
                border border-gray-300
                hover:bg-gray-50
                transition
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="
                px-4 py-2
                text-sm
                rounded-md
                bg-red-600
                text-white
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
    </div>
  );
}
