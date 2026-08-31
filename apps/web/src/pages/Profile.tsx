import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";
import axios from "axios";

export default function Profile(): ReactElement {
  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message ?? "Logout request failed");
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/10.x/lorelei/svg?seed=${user?.id}`}
            alt="avatar"
            className="w-16 h-16 rounded-full border"
          />

          <div>
            <h1 className="text-xl font-semibold">
              {user?.username || "User"}
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-black/90"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="border-t border-gray-300" />
    </div>
  );
}
