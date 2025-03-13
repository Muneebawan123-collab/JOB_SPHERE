import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = user || localStorage.getItem("authToken"); // Check from context and localStorage

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
