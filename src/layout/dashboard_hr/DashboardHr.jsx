import Footer from "@/pages/Shared/footer/Footer";
import Hrheader from "@/pages/Shared/HrHeader/Hrheader";
import React from "react";
import { Outlet } from "react-router";

export default function DashboardHr() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hrheader />

      <main className="flex-1 px-4 py-6">
        <div className="mt-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
