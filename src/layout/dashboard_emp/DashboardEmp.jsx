import Footer from "@/pages/Shared/footer/Footer";
import EmpHeader from "@/pages/Shared/header/EmployeeHeader/EmpHeader";

import React from "react";
import { Outlet } from "react-router";

export default function DashboardHr() {
  return (
    <div className="min-h-screen flex flex-col">
      <EmpHeader></EmpHeader>

      <main className="flex-1 px-4 py-6">
        <div className="mt-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
