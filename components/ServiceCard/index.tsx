import Image from "next/image"
import { Button } from "antd"

export const ServiceCard = ({ image, oldAmount, name, amount, currency, type, buttonProp: { label, onClick } }: { image: string, name: string, type: string, amount: number, oldAmount: string, currency: string, buttonProp: { label: string, onClick: () => void } }) => {
    return (
        <div className='p-6 shadow-elavation-2 cursor-pointer bg-[#967AA1]  flex flex-col rounded-lg  w-full'>
            <div className='w-full flex flex-col'>
                <span className='font-bold text-sm text-white-200 '>{name}</span>
                <span className='font-bold  mt-2 text-xl'>{currency} {Number(amount).toLocaleString()}/month</span>
                <span className='font-bold text-xs line-through '>{currency} {Number(oldAmount).toLocaleString()}</span>
            </div>
            <div className='w-full flex justify-between text-[#898e92] items-center'>
                <span className='font-bold text-sm '></span>
            </div>
            <div className='w-full mt-5'>
                <Image width='450' height='250' className='rounded-md ' src={image} />
            </div>
            <Button onClick={() => onClick()} className='font-bold border-[1.5px] border-solid border-[#49DE80] text-[#49DE80] bg-transparent rounded-xl  mt-6 h-10 text-md '>{label}</Button>
        </div>
    )
}