import React, { useContext, ReactNode } from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Update the path accordingly


interface PathRouteProps {
    path: string;
  }
  
  interface LayoutRouteProps {
    layout: React.ComponentType;
  }
  
  interface IndexRouteProps {
    index: true;
  }
  
  interface PrivateRouteProps extends PathRouteProps, LayoutRouteProps, IndexRouteProps {
    children: ReactNode;
  }

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
    const authContext = useContext(AuthContext);
  
    if (!authContext || !authContext.user) {
      // Redirect to login if user is not authenticated
      return <Navigate to="/login" />;
    }
  
    return <Route {...rest}>{children}</Route>;
  };
  
  export default PrivateRoute;