import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivateRoute = () => {
  const { authUser } = useUser();
  const location = useLocation();

  if (authUser) {
    return <Outlet />;
  } else {
    return <Navigate to="signin" state={{ from: location.pathname }} />;
  }
};

export default PrivateRoute;
