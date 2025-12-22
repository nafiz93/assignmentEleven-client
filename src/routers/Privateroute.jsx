import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import Loading from "@/pages/loadingPage/Loading";

const Privateroute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  if (user) return children;

  return (
    <Navigate
      to="/login"
      replace
      state={{ from: location }}   // or state={{ from: location.pathname }}
    />
  );
};

export default Privateroute;
