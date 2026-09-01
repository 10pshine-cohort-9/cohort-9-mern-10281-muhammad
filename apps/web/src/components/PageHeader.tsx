import type { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function PageHeader({ children }: Props): ReactElement {
  return (
    <header className="h-16 flex items-center justify-between border-b border-gray-300 mb-4">
      {children}
    </header>
  );
}
