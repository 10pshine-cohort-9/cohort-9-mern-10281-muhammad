import { Search } from "lucide-react";
import { useEffect, useRef, type ReactElement } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SearchModal({
  isOpen,
  setIsOpen,
}: Props): ReactElement | null {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "/") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl border border-gray-300 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="search-modal-title" className="sr-only">
          Search notes
        </h2>

        <div className="flex items-center border-b border-gray-300 px-4">
          <Search size={16} className="text-gray-600" />
          <input
            ref={inputRef}
            aria-label="Search notes"
            placeholder="Search notes..."
            className="w-full px-3 py-2 rounded-lg focus:outline-none"
          />
        </div>

        <p className="text-xs text-gray-400 px-4 py-2 text-center">
          In Development...
        </p>

        <div className="flex text-xs text-gray-500 px-4 py-2 border-t border-gray-300">
          <span>
            <kbd className="px-1 border rounded">Ctrl</kbd> +{" "}
            <kbd className="px-1 border rounded">K</kbd>
          </span>
          <span className="border-x px-4 mx-4 border-gray-300">
            <kbd className="px-1 border rounded">/</kbd>
          </span>
          <span>
            <kbd className="px-1 border rounded">Esc</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
