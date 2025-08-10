import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import PropTypes from "prop-types";
import { AuthContext } from "context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loggedIn } = useContext(AuthContext);

  return loggedIn ? children : <Navigate to="/authentication/sign-in/basic" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;