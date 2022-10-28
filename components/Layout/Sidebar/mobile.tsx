import React from "react";
import { NAV_ITEMS } from "./navItem";
import { useAuthContext } from "@providers/authProvider";
import { Menu } from "antd";
import Link from "next/link";

export type SideBarProps = {
    user: {
        email: string;
        name: string;
    };
};

const SideBarMobile = (props: SideBarProps) => {
    const { authData, signOut } = useAuthContext();

    const menu = (
        <Menu>
            <Menu.Item onClick={() => signOut()}>
                <div>Sign Out</div>
            </Menu.Item>
        </Menu>
    );

    return (
        <aside className="w-full flex sm:max-w-[230px] md:max-w-full max-w-full  flex-col justify-between  sticky h-full border-r border-solid border-gray-100 dark:border-black-800 ">
            <div className="flex flex-1 px-[5%] flex-col">
                {NAV_ITEMS.filter((item) =>
                    authData
                        ? !["login", "sign up"].includes(item.title.toLowerCase())
                        : item
                ).map((item) => (
                    <Link key={Math.random()} href={item.path}>
                        <div
                            className={` text-white-200 flex justify-start p-2 mb-5 font-bold bg-[#23232d] rounded-md    items-center cursor-pointer`}
                        >
                            <span className=" font-medium   text-sm ml-5 ">{item.title}</span>
                        </div>
                    </Link>
                ))}
                {authData && (
                    <div
                        onClick={() => signOut()}
                        className={` text-white-200 flex justify-start p-2 mb-5 font-bold bg-[#23232d] rounded-md    items-center cursor-pointer`}
                    >
                        <span className=" font-medium   text-sm ml-5 ">Sign Out</span>
                    </div>
                )}
            </div>
        </aside>
    );
};
export default SideBarMobile;
