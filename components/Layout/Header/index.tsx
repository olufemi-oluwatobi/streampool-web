import React, { useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { useAuthContext } from "../../../providers/authProvider";
import Image from "next/image";

import { Button } from "antd";

export type HeaderProps = {
  title: string;
  icon: string;
  onSearch?: (data: { q: string }) => void;
  onSideMenuClick: () => void;
  user: {
    email: string;
    name: string;
  };
};

const Header = (props: HeaderProps) => {
  const { authData, signOut } = useAuthContext();

  const history = useRouter();

  const renderDesktopOptions = () => {
    return !authData ? (
      <div className=" w-auto flex justify-between items-center ">
        <div className="nav-button-group flex   justify-center items-center">
          <Button
            onClick={() => {
              history.push("/login");
            }}
            className=" bg-transparent outline-none border-none flex items-center text-md  text-gray-1600 dark:text-dark-gray-400  w-fit-content px-2 mx-6 "
          >
            <span>Login</span>
          </Button>
          <Button
            onClick={() => {
              history.push("/signup");
            }}
            className=" flex  justify-center items-center whitespace-nowrap  rounded-md text-black-300 border-none px-10   bg-[#49DE80] text-md h-10
                  w-fit-content "
          >
            <span>Sign up</span>
          </Button>
        </div>
      </div>
    ) : (
      <div className=" w-auto flex justify-between items-center ">
        <div className="nav-button-group flex   justify-center items-center">
          <Button
            onClick={() => {
              history.push("/requests");
            }}
            className=" bg-transparent outline-none border-none flex items-center text-md  text-gray-1600 dark:text-dark-gray-400  w-fit-content px-2 mx-6 "
          >
            <span>Requests</span>
          </Button>
          <Button
            onClick={() => {
              history.push("/settings");
            }}
            className=" bg-transparent outline-none border-none flex items-center text-md  text-gray-1600 dark:text-dark-gray-400  w-fit-content px-2 mx-6 "
          >
            <span>Settings</span>
          </Button>

          <Button
            onClick={() => {
              history.push("/memberships");
            }}
            className=" flex font-bold  justify-center items-center whitespace-nowrap  rounded-lg text-black-300 border-none px-10   bg-[#49DE80] text-md h-10
                  w-fit-content "
          >
            <span>Memberships</span>
          </Button>
          <Button
            onClick={() => {
              signOut();
            }}
            className=" bg-transparent outline-none border-none flex items-center text-md  text-gray-1600 dark:text-dark-gray-400  w-fit-content px-2 mx-6 "
          >
            <span>Sign out</span>
          </Button>
        </div>
      </div>
    );
  };

  // const changeFilterDebounced = useCallback(
  //     _.debounce(value => props.onSearch({ q: value }), 1000),
  //     []
  // )

  return (
    <div
      id="header_one"
      className="flex flex-row justify-between bg-black-700   items-center sm:px-[5%] px-6 py-6 sticky top-0 "
    >
      <div className=" sm:hidden flex flex-none">
        <Image
          width="130"
          height="20"
          src={"/static/images/streamcel1.png"}
          onClick={() => history.push("/")}
          className="  "
        />
      </div>

      <div className=" sm:flex hidden   ">
        <Button
          onClick={() => {
            history.push("/");
          }}
          className=" bg-transparent outline-none border-none flex items-center text-md  text-gray-1600 dark:text-dark-gray-400 px-0  w-fit-content "
        >
          <Image
            width="200"
            height="30"
            src={"/static/images/streamcel1.png"}
            onClick={() => history.push("/")}
            className="  "
          />
        </Button>
      </div>

      <div className=" sm:flex hidden md:hidden lg:flex xl:flex 2xl:flex justify-between items-center  ">
        <div className="flex ml-10 ">{renderDesktopOptions()}</div>
      </div>
      <div className=" sm:hidden md:flex lg:hidden xl:hidden flex justify-center items-center   ">
        <div className=" ml-5 w-9 h-9 rounded-full flex justify-center items-center  ">
          <button
            className="border-none bg-none h-fit w-fit"
            onClick={() => props.onSideMenuClick()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Header;
