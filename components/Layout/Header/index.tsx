import React, { useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { useAuthContext } from "../../../providers/authProvider"
import Styled from "styled-components";
import Image from "next/image";

import { Input, Button } from "antd";

export type HeaderProps = {
    title: string;
    icon: string;
    onSearch?: ({ q: string }) => void;
    onSideMenuClick: () => void;
    user: {
        email: string;
        name: string;
    };
};

const HeaderWrapper = Styled.div<{ darkMode: boolean }>`
    .ant-input{
        background: ${(props) => (props.darkMode ? "#191B1E" : "white")}
    }

    .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
        border-color: #fff;
    }
    
    .ant-select-item {
        padding: 0px !important;
        border: 1px solid red;
     }
    .ant-select-item-option{
        padding: 0px !important;
        border: 1px solid red;
      }
      .ant-select-selection.ant-select-selection--single {
        border-radius: 0px 8px 8px 0px;
        height: 53px;
    }
    
    .ant-select-selection-selected-value {
        height: 53px;
        padding: 0px;
        margin: 0px;
    }
    
    .ant-select-selection__rendered {
        padding: 0px;
        margin: 0px;
    }
    
    .ant-select-dropdown-menu.ant-select-dropdown-menu-root.ant-select-dropdown-menu-vertical {
        padding: 0px;
        margin: 0px;
    }
    
    .ant-select-dropdown-menu-item {
        padding: 0px;
        margin: 0px;
    }
`;

const Header = (props: HeaderProps) => {
    const { authData } = useAuthContext()


    const history = useRouter();

    const [isSearching, setIsSearching] = useState<boolean>(null);



    const changeFilterDebounced = React.useCallback(
        _.debounce(value => props.onSearch({ q: value }), 1000),
        []
    )



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
                        className=" flex  justify-center items-center whitespace-nowrap  rounded-md text-black-300 border-none px-10   bg-[#9DDBAD] text-md h-10
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
                        className=" flex  justify-center items-center whitespace-nowrap  rounded-md text-black-300 border-none px-10   bg-[#9DDBAD] text-md h-10
                  w-fit-content "
                    >
                        <span>Memberships</span>
                    </Button>
                </div>
            </div>
        );
    };

    // const changeFilterDebounced = useCallback(
    //     _.debounce(value => props.onSearch({ q: value }), 1000),
    //     []
    // )

    const renderSearchInput = () => {
        return (
            <HeaderWrapper
                id="header_one"
                // darkMode={theme === "dark"}
                className="flex flex-row w-full justify-between dark:bg-black-700 bg-white-50   items-center sm:px-10 px-6 sm:py-0 md:py-6  py-6 sticky top-0"
            >
                <svg
                    onClick={() => setIsSearching(false)}
                    xmlns="http://www.w3.org/2000/svg"
                    className=" sm:hidden md:flex lg:hidden h-6 mr-4 text-gray-50 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>

                <Input
                    placeholder="Find a gift card"
                    onChange={(e) => changeFilterDebounced(e.target.value)}
                    prefix={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 text-gray-50  w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    }
                    className="bg-white-100 text-white-50   dark:bg-black-700 border-gray-200 dark:border-black-600   w-full h-full "
                ></Input>
            </HeaderWrapper>
        );
    };

    return isSearching ? (
        renderSearchInput()
    ) : (
        <HeaderWrapper id="header_one" className="flex flex-row justify-between bg-black-700   items-center sm:px-10 px-6 py-6 sticky top-0 ">
            <div className=" sm:hidden flex flex-none">
                <Image width='130' height="20" src={'/static/images/streamcel1.png'} onClick={() => history.push("/")} className="  " />
            </div>

            <div className=" sm:flex hidden   ">
                <Button
                    onClick={() => {
                        history.push("/");
                    }}
                    className=" bg-transparent outline-none border-none flex items-center text-md  text-gray-1600 dark:text-dark-gray-400  w-fit-content px-2 mx-6 "
                >
                    <Image width='200' height="30" src={'/static/images/streamcel1.png'} onClick={() => history.push("/")} className="  " />
                </Button>
            </div>


            {/* <div className=" sm:flex hidden md:hidden lg:flex xl:flex 2xl:flex w-4/12 ">{renderSearchInput()}</div> */}
            <div className=" sm:flex hidden md:hidden lg:flex xl:flex 2xl:flex justify-between items-center  ">
                {/* <Switch
                    className="border-none"
                    checked={theme === "dark"}
                    checkedChildren={<Image src={DarkModeIcon} />}
                    unCheckedChildren={<Image src={LightModeIcon} />}
                    onChange={() => setTheme(NEXT_COLOR)}
                /> */}
                <div className="flex ml-10 ">
                    {renderDesktopOptions()}
                    {/* <Dropdown overlay={menu} placement="bottomLeft">
                        <Image src={Avatar} className="  " />
                    </Dropdown>
                    <div className="flex flex-initial  flex-col ml-4">
                        <span className=" text-black-500 dark:text-white-50 font-extrabold  text-base ">
                            {props?.user?.name}
                        </span>
                        <span className=" text-gray-50   text-sm space-x-2 ">
                            {props?.user?.email}
                        </span>   
                    </div> */}
                </div>
            </div>
            <div className=" sm:hidden md:flex lg:hidden xl:hidden flex justify-center items-center   ">
                <div className=" ml-5 w-9 h-9 rounded-full flex justify-center items-center  ">
                    <button className="border-none bg-none h-fit w-fit" onClick={() => props.onSideMenuClick()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </HeaderWrapper>
    );
};
export default Header;
