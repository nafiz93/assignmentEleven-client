import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../authcontext/AuthContext';
import Loading from './Loading';

const Privateroute = ({children}) => {
    const {user,loading}=useContext(AuthContext)
    const location=useLocation();
   if (loading) return <Loading />;


  if (user) {
    return children;
  }
    return <Navigate state={location?.pathname} to="/login"></Navigate>
};

export default Privateroute;