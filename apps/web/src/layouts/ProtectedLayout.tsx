import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/Topbar";

export default function ProtectedLayout(): ReactElement {
  return (
    <div>
      <TopBar />

      <main className="max-w-3xl mx-auto space-y-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
