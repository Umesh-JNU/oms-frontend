import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { logOut } from "../features/authSlice";

const ProtectedRoute = ({ children }) => {
  const { isFetching, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // this will give us the exact date on which the jwt will expire
  //   console.log(new Date(jwt_decode(token)?.exp * 1000).toLocaleDateString());

  useEffect(() => {
    const checkToken = async () => {
      if (token && jwt_decode(token)?.exp < Date.now() / 1000) {
        dispatch(logOut());

        navigate("/");
      }
    };

    checkToken();
  }, [token, navigate]);

  if (!token && !isFetching) {
    return <Navigate to="/home/sign-in" />;
    // return <Navigate to="/" replace={true} />;
  }

  return children;
};

export default ProtectedRoute;
