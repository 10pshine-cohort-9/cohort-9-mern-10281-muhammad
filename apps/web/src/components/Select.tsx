import { Check, ChevronDown } from "lucide-react";
import { useState, type ReactElement } from "react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  "aria-label"?: string;
};

export default function Select({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: Props): ReactElement {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center justify-between gap-3
          min-w-44
          px-3 py-2
          text-sm text-gray-700
          bg-white
          border border-gray-300
          rounded-md
          hover:border-gray-400
          transition
        "
      >
        {selected?.label}

        <ChevronDown
          size={15}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 z-20
            mt-1 w-full
            overflow-hidden
            bg-white
            border border-gray-200
            rounded-md
            shadow-lg
            p-1
          "
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="
                  flex items-center justify-between
                  w-full
                  px-2.5 py-2
                  text-sm text-left
                  rounded
                  hover:bg-gray-100
                  transition
                "
              >
                {option.label}

                {isSelected && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
