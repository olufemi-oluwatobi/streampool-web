import React, { useEffect } from "react";
import { useAuthContext } from "@providers/authProvider";
import { useRouter } from "next/router";
// import { Route, Redirect, useLocation } from 'react-router-dom';

const withAuth = (WrappedComponent: any, isPrivate = true) => {
  return (props) => {
    const { authData } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!authData) {
        router.push("/");
      }
    }, [authData]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
