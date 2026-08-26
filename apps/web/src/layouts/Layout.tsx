import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout(): ReactElement {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="ml-72 h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
