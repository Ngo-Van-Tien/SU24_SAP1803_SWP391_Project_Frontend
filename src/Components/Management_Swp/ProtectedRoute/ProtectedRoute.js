import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Mock function to get current user role
const getUserRole = () => {
  // Replace this with actual user role retrieval logic
  return localStorage.getItem('userRole'); // For example
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userRole = getUserRole();
  const hasAccess = userRole == 'admin'; // Adjust this condition based on your requirement

  return (
    <Route
      {...rest}
      render={props =>
        hasAccess ? (
          <Component {...props} />
        ) : (
          <Redirect to="/unauthorized" /> // Redirect to an unauthorized page or any other page
        )
      }
    />
  );
};

export default ProtectedRoute;
