import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { FileText, Home, Plus, User } from "lucide-react";
import type { ElementType, ReactElement } from "react";

export type Route = { label: string; icon?: ElementType };

export const routeMeta: Record<string, Route> = {
  "": { label: "Home", icon: Home },
  n: { label: "Notes", icon: FileText },
  profile: { label: "Profile", icon: User },
  new: { label: "New note", icon: Plus },
};

export default function TopBar(): ReactElement {
  const location = useLocation();

  const paths = useMemo(
    () => location.pathname.split("/").filter(Boolean),
    [location.pathname],
  );

  const items = useMemo(() => {
    return paths.map((segment, index) => {
      const url = "/" + paths.slice(0, index + 1).join("/");

      const meta = routeMeta[segment] || {
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
      };

      const isActive = index === paths.length - 1;

      return {
        ...meta,
        url,
        isActive,
      };
    });
  }, [paths]);

  const isHomeActive = paths.length === 0;

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-white border-gray-200">
      <nav className="flex items-center text-sm text-gray-500">
        {isHomeActive ? (
          <div className="flex items-center gap-1 text-black font-medium">
            <Home size={14} />
            Home
          </div>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-black transition"
          >
            <Home size={14} />
            Home
          </Link>
        )}

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.url} className="flex items-center">
              <span className="mx-2 text-gray-300">/</span>

              {item.isActive ? (
                <div className="flex items-center gap-1 text-black font-medium">
                  {Icon && <Icon size={14} />}
                  {item.label}
                </div>
              ) : (
                <Link
                  to={item.url}
                  className="flex items-center gap-1 hover:text-black transition"
                >
                  {Icon && <Icon size={14} />}
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
