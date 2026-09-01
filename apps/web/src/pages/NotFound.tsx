import type { ReactElement } from "react";
import { Link } from "react-router-dom";

type Props = {
  message?: string;
};

export default function NotFound({ message }: Props): ReactElement {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div>
          <p className="font-black text-4xl text-center">404</p>
          <p className="text-sm text-center">{message || "Page not found"}</p>
        </div>

        <p className="text-sm text-gray-500">
          Go back to{" "}
          <Link to="/" className="border-b">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
