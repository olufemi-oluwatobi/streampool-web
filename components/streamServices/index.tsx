/* eslint-disable */
import React, { useState, useMemo } from "react";
import className from "classnames";
import { Button } from "antd";
import {
    useStreamService,
    StreamService,
} from "../../providers/streamServiceProvider";
import { ServiceCard } from "../ServiceCard";
import { FLAG_SHIP_CARDS } from "../../constants";

const calculateAmount = (amount: string, numberOfMembers: string) => {
    const amounNum = parseInt(amount, 10);
    const numberOfMembersNum = parseInt(numberOfMembers, 10);
    return Math.ceil((amounNum / numberOfMembersNum + 200) / 100) * 100;
};

const ServiceCategory = ({
    services,
    category,
    onClick,
    isLoading,
    verticalOnMobile = false,
}: {
    services: StreamService[];
    onClick: (service: StreamService) => void;
    isLoading: boolean;
    category: string;
    verticalOnMobile?: boolean;
}) => {
    return (
        <div className=" w-full flex flex-col  justify-center items-center ">
            <div className="flex flex-col w-full justify-start items-start mb-6">
                <span className={className("  font-bold text-3xl capitalize  mb-4 ", { "sm:px-0 px-6": verticalOnMobile })}>
                    {category}.
                </span>
            </div>
            <div className={className({
                " sm:grid flex overflow-x-scroll hide-scroll-bar sm:w-full w-screen ": verticalOnMobile,
            })}>
                <div
                    className={className("w-full", {
                        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2x:grid-cols-4 gap-8 md:gap-2 lg:gap-12":
                            !verticalOnMobile,
                        " sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2x:grid-cols-4 gap-2 md:gap-2 lg:gap-12 flex flex-nowrap sm:px-0 px-6 ": verticalOnMobile,
                    })}
                >
                    {services.length &&
                        isLoading === false &&
                        services?.map((service) => (
                            <div className={className(" sm:ml-0", { "sm:min-w-0 min-w-[270px] mr-6": verticalOnMobile })}>
                                <ServiceCard
                                    buttonProp={{
                                        label: "View Service", onClick: () => onClick(service)
                                    }}
                                    currency={service.streamPlans[0]?.currency}
                                    image={service.icon}
                                    name={service.name}
                                    type="Audio Streaming Service"
                                    amount={
                                        calculateAmount(
                                            service.streamPlans[0]?.amount,
                                            service.streamPlans[0]?.max_limit
                                        )}
                                    oldAmount={service.streamPlans[0]?.amount}
                                    key={`gift-card-key-${Math.random()}`}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const Index = () => {
    const { streamServices, setStreamService, isLoading } = useStreamService();
    const [loadMore, setLoadMore] = useState(false);
    const className =
        "w-full   sm:w-full   md:mr-8  md:w-45%  lg:w-30 xl:w-100 mb-20 ";

    const categories = useMemo(() => {
        const data: string[] = [];
        streamServices.forEach((service) =>
            service.categories.forEach(
                (cat) => !data.includes(cat.name) && data.push(cat.name)
            )
        );
        return data;
    }, [streamServices]);

    // const renderPlaceholder = () => {
    //     return new Array(15)
    //         .fill(16)
    //         .map((card) => FLAG_SHIP_CARDS.includes(card.code))
    //         // .map((giftCard) => <PlaceholderCard className={className} />);
    // };

    const renderData = (category: string) => {
        const services = streamServices.filter(
            (service) =>
                service.categories.filter((cat) => cat.name === category).length
        );
        return (
            <div className="flex mt-20 flex-col">
                <ServiceCategory
                    services={services}
                    isLoading={isLoading}
                    verticalOnMobile={category.toLowerCase() === "popular"}
                    category={category}
                    onClick={(service) => setStreamService(service)}
                />
            </div>
        );
    };

    return (
        <div
            id="gift_card_wrapper"
            className=" flex items-center    justify-center  w-full h-fit-content"
        >
            <div className=" w-full flex flex-col justify-center items-center ">
                {categories.map((cat) => renderData(cat))}
            </div>
        </div>
    );
};

export default Index;
