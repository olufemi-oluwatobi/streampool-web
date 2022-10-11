import React, { useMemo } from "react";
// import a from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import LogoIcon from "../../../assets/images/logo/logo.svg";
import LogoInvertedIcon from "../../../assets/images/logo/logo_inverted.svg";

const Footer = () => {
    const { theme: colorTheme } = useTheme();
    console.log(colorTheme);

    const isDarkMode = colorTheme === "dark";

    const ScrollUpIconDark = "/static/images/icons/scroll_up_dark.svg";
    const ScrollUpIcon = "/static/images/icons/scroll_up_light.svg";

    const Logo = isDarkMode ? LogoInvertedIcon : LogoIcon;

    const ScrollUp = useMemo(
        () => (isDarkMode ? ScrollUpIconDark : ScrollUpIcon),
        [colorTheme, isDarkMode]
    );

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
            className=" px-5% font-inter border-t border-solid border-[#494949]   text-black   flex justify-between py-10 "
        >
            <a>
                <Image width='130' height="20" src={'/static/images/streamcel1.png'} />
            </a>
            <div className="flex">
                {links.map((link => <a className="ml-4"><img src={link.icon} /></a>))}
            </div>
        </section>
    );
};

export default Footer;
