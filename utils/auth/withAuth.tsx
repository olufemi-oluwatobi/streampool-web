import React, { useEffect, useState } from "react";
import { useAuthContext } from "@providers/authProvider";
import { useRouter } from "next/router";
// import { Route, Redirect, useLocation } from 'react-router-dom';

const withAuth = (WrappedComponent: any, isPrivate = true) => {
  return (props) => {
    const { authData, loadStorageData } = useAuthContext();
    const [hasLoadedAuth, setHasLoadedAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (!authData) {
        loadStorageData();
        setHasLoadedAuth(true);
      } else {
        setHasLoadedAuth(true);
      }
    }, [authData]);

    useEffect(() => {
      if (hasLoadedAuth) {
        console.log("TWOEEE");
        if (!authData) {
          router.push("/");
        }
      }
    }, [hasLoadedAuth]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
