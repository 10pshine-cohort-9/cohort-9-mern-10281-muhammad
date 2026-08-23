import { FileText, Plus, Search } from "lucide-react";
import { useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import Tooltip from "./ToolTip";

export default function Sidebar(): ReactElement {
  const isAuth = false;

  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-72 bg-gray-50 border-r border-gray-300 flex flex-col justify-between">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="px-2 py-1 hover:bg-gray-200 rounded w-2/3 block font-semibold text-lg"
            >
              NotPad
            </Link>
            <div className="flex items-center gap-2">
              <Tooltip text="New note">
                <button
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 hover:text-black text-gray-600"
                  onClick={() => navigate("/n/new")}
                >
                  <Plus size={16} />
                </button>
              </Tooltip>
              <Tooltip text="Search">
                <button
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 hover:text-black text-gray-600"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={16} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              className="text-sm flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
            >
              <FileText size={16} />
              Notes
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-300 p-4">
          <ul className="flex flex-col gap-2">
            {isAuth ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm block px-2 py-1 hover:bg-gray-200 rounded text-center"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/10.x/lorelei/svg?seed=${new Date().toISOString()}`}
                      alt="avatar"
                      className="w-8 h-8"
                    />
                    <p>sayhi.hanzla@gmail.com</p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-sm block px-2 py-1 hover:bg-gray-200 rounded text-center"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-sm block bg-black text-white px-2 py-1 rounded text-center"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>

      <SearchModal isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </>
  );
}
