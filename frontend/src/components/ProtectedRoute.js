import React from 'react';
import { Route, Redirect } from "react-router-dom";
import Preloader from './Preloader';

const ProtectedRoute = ({isLoggedIn, path, children, isChecking}) => {
  return (
    <Route path={path} exact>
      { isChecking ? (
        <main className='content'>
          <Preloader />
        </main>
      ) : (
        isLoggedIn ? children : <Redirect to="/sign-in" />
      )}
    </Route>
)}

export default ProtectedRoute;