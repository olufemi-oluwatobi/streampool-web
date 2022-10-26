import React from "react";
import { useAuthContext } from "@providers/authProvider";
import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "./navItem";
import { useRouter } from "next/router";
import Logo from "../../../assets/images/logo/logo_mini.svg";
import Deal from "../../../assets/images/deals/super_deal.svg";

const SideBar = () => {
    const router = useRouter();
    const { authData } = useAuthContext()

    return (
        <aside className="w-full sm:flex sm:max-w-[230px] hidden flex-col justify-between p-8  sticky h-full border-r border-solid border-gray-100 dark:border-black-800 ">
            <div className="flex flex-none">
                <Image src={Logo} className="  " />
                <div className="flex flex-initial flex-col ml-4">
                    <span className=" text-black-500 dark:text-white-50 font-extrabold  text-base ">
                        Digiftng
                    </span>
                    <span className=" text-gray-50    text-sm space-x-2 ">Personal</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col pt-20">
                {NAV_ITEMS.filter((item) => {
                    return authData ? item : !item.isPrivate
                }).map((item) => (
                    <Link key={Math.random()} href={item.path}>
                        <div
                            style={{ padding: "8px 4px 8px 16px", cursor: "pointer" }}
                            className={`flex mb-3 cursor-pointer items-center hover:bg-blue-50  dark:hover:bg-black-800 hover:rounded hover:text-blue-400 ${router.pathname === item.path
                                ? " bg-blue-50 dark:bg-black-800  rounded text-blue-400 "
                                : "text-black-600 dark:text-white-50"
                                }  `}
                        >
                            {item.svgPath}
                            <span className=" font-medium   text-sm ml-5 ">{item.title}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <Image src={Deal} className=" " />
        </aside>
    );
};
export default SideBar;
