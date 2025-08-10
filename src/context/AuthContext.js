import React, { createContext, useState } from "react";
import { baseURL } from "utils/Url";
import axios from "axios";
import PropTypes from "prop-types";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [loggedIn, setLoggedIn] = useState(!!authToken);
  const [user, setUser] = useState(localStorage.getItem("user"));

  console.log("baseUrl", baseURL)

  const queryClient = useQueryClient();

  const loginMutation = useMutation(
    (credentials) =>
      axios.post(`${baseURL}/auth/login`, credentials).then((response) => {
        const { token, refreshToken, username, roles, priviligies, id, fileId, permissions  } =
          response.data;
       
        localStorage.setItem("authToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", username);
        localStorage.setItem("roles", JSON.stringify(roles));
        localStorage.setItem("priviligies", JSON.stringify(priviligies));
        localStorage.setItem("userId", id);
        localStorage.setItem("fileId", fileId);
        localStorage.setItem("permissions", permissions)
        setAuthToken(token);
        setRefreshToken(refreshToken);
        setUser(username);
        setLoggedIn(true);

        queryClient.invalidateQueries();
        return { username };
      }),
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Unknown error";
      
        
      },
      onSuccess: () => {
        // Ensure queries are invalidated and refetched
        queryClient.invalidateQueries(); // Trigger refetch of queries after login
      },
    }
  );

  const logoutHandler = () => {
    localStorage.clear();
    setAuthToken(null);
    setRefreshToken(null);
    setLoggedIn(false);
    window.location.href = "/authentication/sign-in/basic";
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        refreshToken,
        user,
        loggedIn,
        setAuthToken,
        setRefreshToken,
        setLoggedIn,
        logoutHandler,
        loginMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;