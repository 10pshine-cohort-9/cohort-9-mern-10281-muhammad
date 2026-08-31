import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/Topbar";

export default function ProtectedLayout(): ReactElement {
  return (
    <div>
      <TopBar />

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
