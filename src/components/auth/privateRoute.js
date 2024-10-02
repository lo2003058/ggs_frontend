import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {AuthContext} from "../../context/authContext";

function PrivateRoute() {
  const { authTokens } = useContext(AuthContext);

  return authTokens ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default PrivateRoute;
