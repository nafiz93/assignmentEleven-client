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
import Upgragepackage from "@/pages/Hrdashboard/Upgragepackage";
import EmployeeDashboard from "@/pages/employeedashboard/EmployeeDashboard";
import Employeeassets from "@/pages/employeedashboard/Employeeassets";
import Myrequest from "@/pages/employeedashboard/Myrequest";
import Myasset from "@/pages/employeedashboard/Myasset";
import Sendrequest from "@/pages/employeedashboard/Sendrequest";
import Empprofile from "@/pages/employeedashboard/Empprofile";

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
    element: <DashboardEmp />,
    children: [
      {
        path: "/dashboard/employee/home",
        Component: EmployeeDashboard,
      },
      {
        path: "/dashboard/employee/myrequest",
        Component: Myrequest,
      },
      {
        path: "/dashboard/employee/sendrequest",
        Component: Sendrequest,
      },
      {
        path: "/dashboard/employee/myasset",
        Component: Myasset,
      },
      {
        path: "/dashboard/employee/empprofile",
        Component: Empprofile,
      },
      {
        // IMPORTANT: :companyId (matches useParams() usage)
        path: "/dashboard/employee/assets/:companyId",
        Component: Employeeassets,
      },
    ],
  },
  {
    path: "/dashboard/hr",
    element: <DashboardHr />,
    children: [
      { path: "/dashboard/hr/addassets", Component: Addasset },
      { path: "/dashboard/hr/upgrade", Component: Upgragepackage },
      { path: "/dashboard/hr/assetlist", Component: Assetlist },
      { path: "/dashboard/hr/allrequest", Component: Allrequests },
      { path: "/dashboard/hr/employeelist", Component: Employeelist },
      { path: "/dashboard/hr/profile", Component: Hrprofile },
    ],
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
