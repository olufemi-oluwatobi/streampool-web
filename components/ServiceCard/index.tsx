import Image from "next/image";
import { Button } from "antd";

export const ServiceCard = ({
    image,
    oldAmount,
    name,
    amount,
    currency,
    hasNotification,
    type,
    buttonProp: { label, onClick },
}: {
    image: string;
    name: string;
    type: string;
    amount: number;
    oldAmount: string;
    currency: string;
    hasNotification?: boolean;
    buttonProp: { label: string; onClick: () => void };
}) => {
    return (
        <div className="shadow-elavation-2 relative cursor-pointer text-white-500 bg-transparent border-solid border border-[#5e6163] flex flex-col rounded-lg  w-full">
            <div className="w-full">
                <Image width="450" height="250" className="rounded-t-md " src={image} />
            </div>
            <div className="flex flex-col  p-4">
                <div className="w-full flex justify-between">
                    <div className="w-full  flex flex-col">
                        <span className=" text-sm text-[#999a9b] ">{name}</span>
                        <span className="font-bold  text-md">
                            {currency} {Number(amount).toLocaleString()}/month
                        </span>
                        {/* <span className='font-bold text-xs line-through '>{currency} {Number(oldAmount).toLocaleString()}</span> */}
                    </div>
                    {/* <span className="flex h-1 w-1">
                        <span className="animate-ping  h-full w-full rounded-full bg-white-300 opacity-75"></span>
                    </span>{" "} */}
                    {hasNotification && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-4 text-red-500 font-extrabold animate-bounce h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                            />
                        </svg>
                    )}
                </div>
                <div className="w-full flex justify-between text-[#898e92] items-center">
                    <span className="font-bold text-sm "></span>
                </div>

                <Button
                    onClick={() => onClick()}
                    className="font-bold  bg-white-400 text-black-400  rounded-3xl  mt-6 h-10 text-md "
                >
                    {label}
                </Button>
            </div>
        </div>
    );
};

export const ServiceCardPlaceholder = () => {
    return (
        <div className="shadow-elavation-2 flex-1 cursor-pointer text-white-500 bg-transparent border-solid border border-[#5e6163] flex flex-col rounded-lg w-full">
            <div className="w-full relative">
                <img
                    className="rounded-t-md w-[350px] h-0 invisible "
                    src={
                        "https://res.cloudinary.com/drda29q8x/image/upload/v1664460585/stream%20service%20logos/Group_24_j0h6cl.png"
                    }
                />
                <div
                    className={` w-full animate-pulse h-[200px] relative z-10  bg-slate-700 rounded-t-md`}
                ></div>
            </div>
            <div className="flex flex-col p-4">
                <div className=" w-1/2  flex flex-col">
                    <div className="w-full animate-pulse h-2  bg-slate-700 rounded"></div>
                    <div className="w-full mt-2 animate-pulse h-2  bg-slate-700 rounded"></div>
                    {/* <span className='font-bold text-xs line-through '>{currency} {Number(oldAmount).toLocaleString()}</span> */}
                </div>
                <div className="w-full mt-6 h-10 animate-pulse  bg-slate-700 rounded-3xl"></div>

                {/* <Button onClick={() => onClick()} className='font-bold  bg-white-400 text-black-400  rounded-3xl  mt-6 h-10 text-md '>{label}</Button> */}
            </div>
        </div>
    );
};
