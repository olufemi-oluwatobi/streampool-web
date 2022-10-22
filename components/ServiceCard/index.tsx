import Image from "next/image";
import { Button } from "antd";

export const ServiceCard = ({
    image,
    oldAmount,
    name,
    amount,
    currency,
    type,
    buttonProp: { label, onClick },
}: {
    image: string;
    name: string;
    type: string;
    amount: number;
    oldAmount: string;
    currency: string;
    buttonProp: { label: string; onClick: () => void };
}) => {
    return (
        <div className="shadow-elavation-2 cursor-pointer text-white-500 bg-transparent border-solid border border-[#5e6163] flex flex-col rounded-lg  w-full">
            <div className="w-full">
                <Image width="450" height="250" className="rounded-t-md " src={image} />
            </div>
            <div className="flex flex-col p-4">
                <div className="w-full  flex flex-col">
                    <span className=" text-sm text-[#999a9b] ">{name}</span>
                    <span className="font-bold  text-md">
                        {currency} {Number(amount).toLocaleString()}/month
                    </span>
                    {/* <span className='font-bold text-xs line-through '>{currency} {Number(oldAmount).toLocaleString()}</span> */}
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
        <div className="shadow-elavation-2 cursor-pointer text-white-500 bg-transparent border-solid border border-[#5e6163] flex flex-col rounded-lg w-full">
            <div className="w-full relative">
                <Image width="450" height="0" className="rounded-t-md absolute " src={"https://res.cloudinary.com/drda29q8x/image/upload/v1664461277/stream%20service%20logos/Group_25_exwxtv.png"} />
                <div className={` mt-[-23px] w-full animate-pulse h-[200px] relative z-10  bg-slate-700 rounded-t-md`}></div>
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
