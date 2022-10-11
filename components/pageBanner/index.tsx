import React from "react"
import className from "classnames"

const HeaderBanner = ({ title }: { title: string }) => {
    return (
        <section className="  ">
            <div className="flex w-full px-[5%] sm:py-20 py-10  flex-wrap mb-10 justify-between  items-center bg-jigsaw_bg bg-no-repeat bg-cover  ">
                <span className={className(" text-4xl md:text-6xl lg:text-8xl  font-bold capitalize  mb-2  ")}>
                    {title}
                </span>
            </div>
        </section>
    )
}

export default HeaderBanner