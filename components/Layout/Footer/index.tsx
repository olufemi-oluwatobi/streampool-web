import React, { useMemo } from "react";
// import a from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import LogoIcon from "../../../assets/images/logo/logo.svg";
import LogoInvertedIcon from "../../../assets/images/logo/logo_inverted.svg";

const Footer = () => {
    const { theme: colorTheme } = useTheme();

    const links = useMemo(
        () => [
            {
                title: "facebook",
                link: "https://facebook.com/digiftng",
                icon: "/static/images/icons/ic_facebook_white.svg",
            },
            {
                title: "twitter",
                link: "https://twitter.com/digiftng",
                icon: "/static/images/icons/ic_twitter_white.svg",
            },
            {
                title: "instagram",
                link: "https://instagram.com/digiftng",

                icon: "/static/images/icons/ic_instagram_white.svg",
            },
        ],
        []
    );


    return (
        <section
            id="footer_wrapper"
            className=" px-5% font-inter border-t border-solid border-[#494949]   text-black   flex justify-between items-center py-4 "
        >
            <a>
                <Image width='130' height="20" src={'/static/images/streamcel1.png'} />
            </a>
            <div className="flex items-center">
                {links.map((link => <a className="ml-4 w-4 h-4 "><img src={link.icon} /></a>))}
            </div>
        </section>
    );
};

export default Footer;
