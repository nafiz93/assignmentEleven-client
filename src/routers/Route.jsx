import { createBrowserRouter } from "react-router";
import Rootlayout from "../layout/Rootlayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/auth/login/Login";
import Authlayout from "../layout/Authlayout";
import Register from "../pages/auth/register/Register";
import DashboardHr from "@/layout/dashboard_hr/DashboardHr";
import DashboardEmp from "@/layout/dashboard_emp/DashboardEmp";
import Addasset from "@/pages/Hrdashboard/Addasset";
import Assetlist from "@/pages/Hrdashboard/Assetlist";
import Allrequests from "@/pages/Hrdashboard/Allrequests";
import Employeelist from "@/pages/Hrdashboard/Employeelist";
import Hrprofile from "@/pages/Hrdashboard/Hrprofile";
import Employeeassets from "@/pages/employeedashboard/Employeeassets";
import Myrequest from "@/pages/employeedashboard/Myrequest";
import Myasset from "@/pages/employeedashboard/Myasset";
import Empprofile from "@/pages/employeedashboard/Empprofile";
import Privateroute from "./Privateroute";
import Upgrade from "@/pages/Hrdashboard/Upgrade";
import PaymentSuccess from "@/pages/Hrdashboard/PaymentSuccess";
import PaymentCancel from "@/pages/Hrdashboard/PaymentCancel";
import HrDashboardHome from "@/pages/Hrdashboard/HrDashboardHome";
import Empdashboard from "@/pages/employeedashboard/Empdashboard";
import EmployeeDashboard from "@/pages/employeedashboard/EmployeeDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Rootlayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: "/dashboard/employee",
    element: (
      <Privateroute>
        <DashboardEmp />
      </Privateroute>
    ),
    children: [
      {
        index: true,
        Component: Empdashboard,
      },
      {
        path: "send_Request",
        Component: EmployeeDashboard,
      },

      {
        path: "home",
        Component: Empdashboard,
      },
      {
        path: "myrequest",
        Component: Myrequest,
      },
      {
        path: "myasset",
        Component: Myasset,
      },
      {
        path: "empprofile",
        Component: Empprofile,
      },
      {
        path: "assets/:companyId",
        Component: Employeeassets,
      },
    ],
  },

  {
    path: "/dashboard/hr",
    element: (
      <Privateroute>
        <DashboardHr />
      </Privateroute>
    ),
    children: [
      {
        index: true,
        Component: HrDashboardHome,
      },

      {
        path: "addassets",
        Component: Addasset,
      },
      {
        path: "upgrade",
        Component: Upgrade,
      },
      {
        path: "assetlist",
        Component: Assetlist,
      },
      {
        path: "allrequest",
        Component: Allrequests,
      },
      {
        path: "employeelist",
        Component: Employeelist,
      },
      {
        path: "profile",
        Component: Hrprofile,
      },
    ],
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment-cancel",
    element: <PaymentCancel />,
  },
  {
    path: "/",
    Component: Authlayout,
    children: [
      { path: "/login", Component: Login },
      { path: "/register/:role", Component: Register },
    ],
  },
]);
