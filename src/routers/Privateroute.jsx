import useAuth from '@/hooks/useAuth';
import Loading from '@/pages/loadingPage/Loading';
import React, { } from 'react';
import { useLocation } from 'react-router';


const Privateroute = ({children}) => {
    const {user,loading}=useAuth()
    const location=useLocation();
   if (loading) return <Loading></Loading>;


  if (user) {
    return children;
  }
    return <Navigate state={location?.pathname} to="/login"></Navigate>
};

export default Privateroute;