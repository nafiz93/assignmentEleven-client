import { createBrowserRouter } from "react-router";
import Rootlayout from "../layout/Rootlayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/auth/login/Login";
import Authlayout from "../layout/Authlayout";
import Register from "../pages/auth/register/Register";

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
