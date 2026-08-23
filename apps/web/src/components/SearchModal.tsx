import { Search } from "lucide-react";
import type { ReactElement } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SearchModal({
  isOpen,
  setIsOpen,
}: Props): ReactElement | null {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-start justify-center pt-24 bg-black/30 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-gray-300 px-4">
          <Search size={16} className="text-gray-600" />
          <input
            autoFocus
            placeholder="Search notes..."
            className="w-full px-3 py-2 rounded-lg focus:outline-none"
          />
        </div>

        <p className="text-xs text-gray-400 px-2 py-1 text-center mb-2">
          In Development...
        </p>
      </div>
    </div>
  );
}
