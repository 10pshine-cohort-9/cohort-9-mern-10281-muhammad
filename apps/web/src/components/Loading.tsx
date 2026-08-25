import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
