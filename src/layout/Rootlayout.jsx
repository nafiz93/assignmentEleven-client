import React from "react";
import { Outlet } from "react-router";
import Footer from "../pages/Shared/footer/Footer";
import Header from "../pages/Shared/header/Header";

export default function Rootlayout() {
  return (
    <div>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
}
