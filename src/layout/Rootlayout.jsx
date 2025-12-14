import React from "react";
import { Outlet } from "react-router";
import Footer from "../pages/Shared/footer/Footer";
import Header from "../pages/Shared/header/Header";

export default function Rootlayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
