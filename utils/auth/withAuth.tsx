import React, { } from 'react'
import { useAuthContext } from '@providers/authProvider';
import { useRouter } from 'next/router'
// import { Route, Redirect, useLocation } from 'react-router-dom';

const withAuth = (WrappedComponent: any, isPrivate = true) => {
  return (props) => {
    const { authData } = useAuthContext()
    const location = useRouter();

    if (!authData) {
      location.push("/")
      return <div />
    } else {
      return (
        <WrappedComponent {...props} />
      )
    }
  };
};

export default withAuth;