import { createBrowserRouter } from "react-router";
import Rootlayout from "../layout/Rootlayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/auth/login/Login";
import Authlayout from "../layout/Authlayout";
import Register from "../pages/auth/register/Register";
import DashboardHr from "@/layout/dashboard_hr/DashboardHr";
import Assets from "@/pages/assets/Assets";
import DashboardEmp from "@/layout/dashboard_emp/DashboardEmp";
import Request from "@/pages/request/Request";

export const router = createBrowserRouter(
  [
    {
      path:"/",
      Component: Rootlayout,
      children: [
        {
          index:true,
          Component:Home
        },
      ],
    },
    {
      path:"/dashboard/employee",
      element:<DashboardEmp></DashboardEmp>,
      children: [
        {
          path:'/dashboard/employee/Myrequest',
          Component:Request
        },
       
      ],
    },
    {
      path:"/dashboard/hr",
      element:<DashboardHr></DashboardHr>,
      children: [
        {
          path:'/dashboard/hr/assets',
          Component:Assets
        },
       
      ],
    },
    {
      path:"/",
      Component: Authlayout ,
      children: [
        {
          path:'/login',
          Component:Login
        },
        {
          path:'/register/:role',
          Component:Register
        },
      ],
    },
  ],
 
);
