import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout(): ReactElement {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="ml-72 h-screen overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
