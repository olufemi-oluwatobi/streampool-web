import { useCallback } from "react"
import { Tag } from "antd";
import { format, parseISO, addMonths } from "date-fns"
import { StreamService, StreamPlan, PoolType } from "@interfaces/";
import { Button, Checkbox, Modal } from "antd";
import classNames from "classnames";

const { confirm } = Modal;


const calculateAmount = (amount: string, numberOfMembers: string) => {
    if (!amount) return;
    const amounNum = parseInt(amount, 10);
    const numberOfMembersNum = parseInt(numberOfMembers, 10);

    return Math.ceil((amounNum / numberOfMembersNum + 200) / 100) * 100;
};


const ServiceDetails = ({
    streamService,
    selectedPlan,
    isLoading,
    onClick,
    onSelectPlan,
    onCancel,
    status,
    pool,
    email
}: {
    streamService: StreamService;
    selectedPlan: StreamPlan;
    isLoading: boolean;
    onClick: () => void;
    onCancel: () => void;
    onSelectPlan: (plan: StreamPlan) => void;
    status?: "pending request" | "active membership" | null | undefined
    pool?: PoolType
    email?: string
}) => {
    const getNextSubMonth = (d: string) => {
        d = format(parseISO(pool.payment_date), "dd")
        const currDay = format(new Date(), "dd")
        const currentDate = format(new Date(), "mm yyyy")
        const nextMonth = format(addMonths(new Date(), 1), "mm yyyy")
        const hasPassed = Number(d) > Number(currDay)
        if (!hasPassed) return `${d}-${currentDate}`
        return `${d} ${nextMonth}`
    }

    const showCancelRequestConfirm = () => {
        confirm({
            title: 'Are you sure you want to cancel your request',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                </svg>
            ),
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {

            },
        });
    };

    const renderMainButton = useCallback(() => {
        const onClickReq = {
            "pending request": () => showCancelRequestConfirm(),
            "active membership": () => showCancelRequestConfirm()
        }
        const onAction = status ? onClickReq[status] : onClick
        if (status === "pending request" || !status) {
            return (
                <Button
                    loading={isLoading}
                    onClick={() => onAction()}
                    className={classNames("w-full  h-10 mt-10 font-bold border-none  text-md rounded-md text-black-300 ", { "bg-[#9DDBAD]": !status, "bg-[#BA1200] text-white-200": status === "pending request" })}
                >
                    {status === "pending request" ? "Cancel Request" : "Request Membership"}
                </Button>
            )
        }
        return (
            <div className="w-full h-10  mt-10 font-bold justify-center items-center border-none bg-none  text-md"
            >
                <Button
                    loading={isLoading}
                    onClick={() => onClick()}
                    className=" w-fit-content h-fit-content mt-4 justify-center items-center border-none bg-transparent  text-md"
                >
                    <span className=" text-[#BA1200] ">Cancel Membership</span>
                </Button>
            </div>
        )
    }, [status])

    return (
        <div className="flex flex-col justify-center text-center">
            <div className="w-full flex mb-10 items-center justify-between text-white-200   ">
                <div className="flex items-center mr-8  ">
                    <span className=" text-base   ">Membership</span>
                </div>
                <button
                    onClick={() => onCancel()}
                    className=" outline-none bg-none  w-6 h-6 justify-center items-center bg-[#444444] flex rounded-full "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            <div className="flex justify-between border-0 border-b border-solid border-[#494949] mb-6 pb-4">
                <div className="flex justify-start  items-center  ">
                    <img className=" h-14 w-14 rounded-full " src={streamService?.icon} />
                    <div className="flex flex-col justify-start  items-start text-white-200 ml-3">
                        <span className=" text-lg font-bold ">{streamService?.name}</span>
                        <Tag className="mt-2 rounded-md " color="geekblue">audio streaming</Tag>
                    </div>
                </div>
            </div>
            {status && (<div className="w-full flex flex-col">
                <div className="w-full flex justify-between">
                    <span className="text-gray-300">Plan</span>
                    <span className="  text-white-200 font-bold  text-md ">
                        {selectedPlan?.name}
                    </span>
                </div>
                {status && <div className="w-full flex mt-2  justify-between">
                    <span className="text-gray-300">Email</span>
                    <span className=" font-bold  text-white-200  text-md ">
                        {email}
                    </span>
                </div>}
                <div className="w-full mt-2 flex justify-between">
                    <span className="text-gray-300">Amount</span>
                    <span className="  text-white-200 font-bold text-md ">
                        {selectedPlan?.currency} {calculateAmount(
                            selectedPlan?.amount,
                            selectedPlan?.max_limit
                        )?.toLocaleString()}
                    </span>
                </div>
                <div className="w-full mt-2 flex justify-between">
                    <span className="text-gray-300">Status</span>
                    <span>
                        <Tag className="h-fit-content rounded-md mr-0 " color={status !== "pending request" ? "green" : "volcano"} >
                            {status}
                        </Tag>
                    </span>

                </div>
                {pool && status === "active membership" && <div className="w-full flex mt-2 my-4 justify-between">
                    <span className="text-gray-300">Next Subscription Date</span>
                    <span className=" font-bold  text-white-200  text-md ">
                        {getNextSubMonth(pool?.payment_date)}
                    </span>
                </div>}
            </div>)}
            {!status && streamService?.streamPlans.map((plan) => (
                <div className="w-full rounded-md flex justify-between items-center px-4 py-2 mb-4 border-[#494949] border-solid border ">
                    <div className="flex flex-col items-start justify-start  ">
                        <span className=" text-base font-bold text-white-200 ">
                            {plan.name}
                        </span>
                        <span className=" text-md text-gray-300 ">
                            {plan.currency} {Number(plan.amount)?.toLocaleString()} -{" "}
                            {plan.max_limit} members
                        </span>
                    </div>
                    <Checkbox
                        checked={
                            plan.id === selectedPlan?.id ||
                            streamService?.streamPlans.length === 1
                        }
                        onClick={() => onSelectPlan(plan)}
                    />
                </div>
            ))}

            {!status && <div className=" w-full flex justify-start  flex-col items-start my-4 i text-white-200 ">
                <span className=" font-bold text-5xl">
                    {selectedPlan?.currency}{" "}
                    {calculateAmount(
                        selectedPlan?.amount,
                        selectedPlan?.max_limit
                    )?.toLocaleString()}
                </span>
                <span className=" line-through text-red-300  text-md ">
                    {selectedPlan?.currency} {selectedPlan?.amount}
                </span>
            </div>}
            {renderMainButton()}
        </div>
    );
};

export default ServiceDetails;
