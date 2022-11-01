import { ChangeEvent, useCallback, useMemo } from "react";
import { Transition } from "@tailwindui/react";
import Image from "next/image";
import { Collapse, Avatar } from "antd";
import { Tag, Input, Slider, Form, Badge } from "antd";
import { decryptPassword } from "@utils/helpers";
import useCopyToClipboard from "@hooks/useCopy";
import { useNotification } from "@providers/notificationProvider";
import { format, parseISO, addMonths } from "date-fns";
import {
    StreamService,
    StreamPlan,
    PoolType,
    UserType,
    PoolRequestType,
} from "../../interfaces";
import StreamOptions from "@components/streamplanOptions";
import { Button, Checkbox, Modal } from "antd";
import classNames from "classnames";
import { FormikErrors } from "formik";

const { confirm } = Modal;

type ButtonProp = {
    onClick: () => void;
    label: string;
    style?: React.CSSProperties;
    className: string;
};

const calculateAmount = (amount: string, numberOfMembers: string) => {
    if (!amount) return;
    const amounNum = parseInt(amount, 10);
    const numberOfMembersNum = parseInt(numberOfMembers, 10);

    return Math.ceil((amounNum / numberOfMembersNum + 200) / 100) * 100;
};

const SubmitPoolCredentials = ({
    streamService,
    streamPlan,
    onChange,
    show,
    errors,
}: {
    streamService: StreamService;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    show: boolean;
    streamPlan: StreamPlan;
    errors: FormikErrors<{ [key: string]: string }>;
}) => {
    const infoText =
        streamService.entrance_type === "credentials"
            ? "Your credentials will be shared only to members of your pool. Please use a password you're willing to part with"
            : "Membership to this stream service is based invitation. Please note that you'll have to add members to your account manually ";
    return (
        <Transition
            show={show}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="w-full p-4  border rounded-md border-[#494949] modal-input flex flex-col">
                <div className=" bg-[#ffffff] mb-10 flex font-medium  justify-start items-start  text-left text-black-500 rounded-md  p-2 ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-14 font-extrabold h-14 mr-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                    </svg>
                    {infoText}
                </div>
                <Form.Item
                    validateStatus={errors?.email ? "error" : "success"}
                    help={errors?.email && errors?.email}
                    label="Membership Email Address"
                    name="email"
                >
                    <Input
                        className="h-10"
                        name="email"
                        onChange={onChange}
                        placeholder="Enter the memberships email address"
                    />
                </Form.Item>
                {streamService.entrance_type === "credentials" ? (
                    <Form.Item
                        validateStatus={errors?.password ? "error" : "success"}
                        help={errors?.password && errors?.password}
                        label="Password"
                        name="password"
                    >
                        <Input
                            onChange={onChange}
                            className="h-10"
                            placeholder="Enter account password"
                        />
                    </Form.Item>
                ) : (
                    ""
                )}
                <Form.Item
                    validateStatus={errors?.maxMemberCount ? "error" : "success"}
                    help={errors?.maxMemberCount && errors?.maxMemberCount}
                    label="Number of Members"
                    name="maxMemberCount"
                >
                    <Slider
                        onChange={(value) => {
                            onChange({
                                target: { name: "maxMemberCount", value },
                            } as ChangeEvent<HTMLInputElement>);
                        }}
                        defaultValue={parseInt(streamPlan?.max_limit, 10) - 1}
                        max={parseInt(streamPlan?.max_limit, 10) - 1}
                    />
                </Form.Item>
            </div>
        </Transition>
    );
};

const MembersComponent = ({ member }: { member: UserType }) => {
    return (
        <div className="w-full flex  items-center border-b pb-4 border-solid border-[#494949]">
            <Avatar style={{ backgroundColor: "#000000" }}>
                {member?.username?.split("")[0].toUpperCase()}
            </Avatar>
            <div className="flex flex-col ml-3 text-left justify-start items-start">
                <span className=" font-bold text-sm text-white-200 ">
                    {member.username}
                </span>
                <span className=" text-sm text-gray-300 ">{member.email}</span>
            </div>
        </div>
    );
};

const UserRequest = ({
    member,
    onAccept,
}: {
    member: UserType;
    onAccept: (userId: string) => void;
}) => {
    const [copiedText, copyToClipboard] = useCopyToClipboard();
    const { triggerNotification } = useNotification();
    const copyPoolPassword = (email: string) => {
        copyToClipboard(email);
        triggerNotification("Copied Email", "Copied Email", "success");
    };

    return (
        <div className="w-full flex justify-between items-center border-b py-2 border-solid border-[#494949]">
            <div className="flex justify-center items-center ">
                <Avatar style={{ backgroundColor: "#000000" }}>
                    {member?.username?.split("")[0].toUpperCase()}
                </Avatar>
                <div className="flex flex-col ml-3 justify-start items-start">
                    <span className=" font-bold text-sm text-white-200 ">
                        {member.username}
                    </span>
                </div>
            </div>

            <div className="flex flex-col ml-3 justify-start items-center">
                <div className="flex">
                    {!copiedText ? (
                        <button
                            onClick={() => copyPoolPassword(member.email)}
                            className="w-fit-content flex items-center ml-1 text-white-200 h-fit-content"
                        >
                            <span className="mr-2  text-white-200 text-sm ">Copy Email</span>
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
                                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                                />
                            </svg>
                        </button>
                    ) : (
                        <Button
                            onClick={() => onAccept(member.id)}
                            className=" bg-white-200 p-2  flex justify-center items-center text-sm border-none text-black-500 rounded-3xl "
                        >
                            <span className="text-black-500 mt-[0.5px] mr-2">Accept</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 mt-1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ServiceDetails = ({
    streamService,
    selectedPlan,
    isLoading,
    onSelectPlan,
    onCancel,
    errors,
    status,
    pool,
    email,
    buttonProps,
    offerBoxProps,
    isPoolOwner,
    poolRequestsProps,
}: {
    streamService: StreamService;
    selectedPlan: StreamPlan;
    isLoading: boolean;
    onCancel: () => void;
    onSelectPlan: (plan: StreamPlan) => void;
    status?: "pending request" | "active membership" | null | undefined;
    pool?: PoolType;
    email?: string;
    errors?: FormikErrors<{}>;
    poolRequestsProps?: {
        requests: PoolRequestType[];
        onAccept: (
            requestPoolId: number,
            data: { userId: string; poolId: number }
        ) => void;
    };
    offerBoxProps?: {
        isVisible: boolean;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    };
    buttonProps: Array<ButtonProp> | ButtonProp;
    isPoolOwner?: boolean;
}) => {
    const buttons = Array.isArray(buttonProps) ? buttonProps : [buttonProps];
    const { triggerNotification } = useNotification();
    const [copiedText, copyToClipboard] = useCopyToClipboard();

    const copyPoolPassword = (password: string) => {
        const decryptedPassword = decryptPassword(
            password,
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY
        );
        copyToClipboard(decryptedPassword);
        triggerNotification("Password Copied", "Password Copied!", "success");
    };

    const renderMainButton = () => {
        return (
            <div className="w-full mb-4 flex sm:flex-row flex-col justify-between font-bold items-start border-none bg-none  text-md">
                {buttons.map((buttonProp, index) => (
                    <Button
                        loading={isLoading}
                        onClick={() => buttonProp.onClick()}
                        style={buttonProp?.style}
                        className={classNames(
                            ` flex-1 sm:w-full w-full h-10 sm:py-0 py-3 rounded-3xl mt-4 text-md`,
                            buttonProp?.className,
                            { "sm:ml-5": buttons.length > 1 && index > 0 },
                            "justify-center items-center"
                        )}
                    >
                        <span
                            className="text-center"
                            style={{ color: buttonProp?.style?.color }}
                        >
                            {buttonProp.label}
                        </span>
                    </Button>
                ))}
            </div>
        );
    };

    return (
        <Form className="w-full items-center" layout="vertical">
            <div className="flex w-full flex-col justify-center text-center">
                <div className="sm:flex hidden  justify-between border-0 border-b border-solid border-[#494949] mb-6 pb-4">
                    <div className="flex justify-start  items-center  ">
                        <img
                            className=" h-14 w-14 rounded-full "
                            src={streamService?.icon}
                        />
                        <div className="flex flex-col justify-start  items-start text-white-200 ml-3">
                            <span className=" text-lg font-bold ">{streamService?.name}</span>
                            <Tag className="mt-2 rounded-md " color="geekblue">
                                audio streaming
                            </Tag>
                        </div>
                    </div>
                </div>
                {(status || isPoolOwner) && (
                    <div className="w-full flex flex-col">
                        <div className="w-full flex justify-between">
                            <span className="text-gray-300">Plan</span>
                            <span className="  text-white-200 font-bold  text-md ">
                                {selectedPlan?.name}
                            </span>
                        </div>

                        <div className="w-full flex mt-2  justify-between">
                            <span className="text-gray-300">Email</span>
                            <span className=" font-bold  text-white-200  text-md ">
                                {email}
                            </span>
                        </div>

                        <div className="w-full mt-2 flex justify-between">
                            <span className="text-gray-300">Amount</span>
                            <span className="  text-white-200 font-bold text-md ">
                                {selectedPlan?.currency}{" "}
                                {calculateAmount(
                                    selectedPlan?.amount,
                                    selectedPlan?.max_limit
                                )?.toLocaleString()}
                            </span>
                        </div>
                        {pool && (status === "active membership" || isPoolOwner) && (
                            <div className="flex flex-col">
                                <div className="w-full flex mt-2 justify-between">
                                    <span className="text-gray-300">Next Subscription Date</span>
                                    <span className=" font-bold  text-white-200  text-md ">
                                        {pool?.payment_date &&
                                            format(parseISO(pool.payment_date), "dd-MM-yyyy")}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="w-full mt-2 flex justify-between">
                            <span className="text-gray-300">Status</span>
                            <span>
                                <Tag
                                    className="h-fit-content rounded-md mr-0 "
                                    color={
                                        (isPoolOwner && "magenta") || status !== "pending request"
                                            ? "green"
                                            : "volcano"
                                    }
                                >
                                    {(isPoolOwner && "Owner") || status}
                                </Tag>
                            </span>
                        </div>

                        {pool &&
                            (status === "active membership" || isPoolOwner) &&
                            pool?.streamService.entrance_type === "credentials" && (
                                <div className="flex flex-col">
                                    <div className="flex flex-col justify-start items-start">
                                        <div className="flex flex-col items-start">
                                            <span className="text-white-100 text-lg mt-6">
                                                Account Credentials
                                            </span>
                                            <span className=" text-gray-300  text-md mt-1">
                                                Use this to login into your {pool?.streamService?.name}{" "}
                                                account
                                            </span>
                                        </div>
                                        <div className="w-full flex mt-6 justify-between">
                                            <span className="text-gray-300">Email</span>
                                            <button
                                                onClick={() => {
                                                    copyToClipboard(
                                                        pool?.poolCredential?.account_email ||
                                                        pool?.poolCredential?.email?.email
                                                    );
                                                    triggerNotification(
                                                        "Email Address Copied",
                                                        "Copied Email Address!",
                                                        "success"
                                                    );
                                                }}
                                                className="w-fit-content flex items-center ml-1 text-white-200 h-fit-content"
                                            >
                                                <span className=" font-bold mr-2  text-white-200  text-md ">
                                                    {pool?.poolCredential?.account_email ||
                                                        pool?.poolCredential?.email?.email}
                                                </span>
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
                                                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="w-full flex mt-2 mb-6 justify-between">
                                            <div>
                                                <span className="text-gray-300">Password</span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    copyPoolPassword(pool?.poolCredential?.password)
                                                }
                                                className="w-fit-content flex items-center ml-1 text-white-200 h-fit-content"
                                            >
                                                <span className=" font-bold mr-2  text-white-200  text-md ">
                                                    Copy Password
                                                </span>
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
                                                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="w-full mb-10 justify-center items-center">
                                            <Button className="bg-transparent border-solid border text-white-200 rounded-3xl border-gray-300">
                                                Edit credentials
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
                {isPoolOwner && (
                    <div className="w-full flex flex-col ">
                        <Collapse
                            expandIconPosition="right"
                            accordion
                            defaultActiveKey="one"
                            expandIcon={({ isActive }) => (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24 "
                                    strokeWidth={5}
                                    stroke="currentColor"
                                    className={classNames("w-4 h-4 text-white-200", {
                                        "rotate-180": isActive,
                                    })}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            )}
                        >
                            <Collapse.Panel
                                key={"one"}
                                className="mt-5 text-xl"
                                header={
                                    <div className="flex items-center ">
                                        <span className=" text-base text-white-200 mr-2 ">
                                            Pool Members
                                        </span>
                                        <div className="rounded-3xl w-10 bg-white-400  flex text-sm justify-center items-center text-black-400 ">
                                            {pool.members_count || 0}
                                        </div>
                                        {/* <Badge
                                        title={"Member count"}
                                        showZero
                                        style={{
                                            backgroundColor: "#00000",
                                            width: "20px",
                                        }}
                                        className="h-4 text-md mb-1 "
                                        count={pool.members_count || 0}
                                    /> */}
                                    </div>
                                }
                            >
                                {pool.members.length ? (
                                    pool.members.map((member, index) => (
                                        <MembersComponent member={member} />
                                    ))
                                ) : (
                                    <div className="flex flex-col mb-10 justify-center items-center">
                                        <Image
                                            src="/static/images/empty_members.svg"
                                            width="150"
                                            height="150"
                                        />
                                        <span className="text-sm sm:w-full w-2/3 text-white-300">
                                            Your membership pool is empty, you have no members, for
                                            now
                                        </span>
                                    </div>
                                )}
                            </Collapse.Panel>
                        </Collapse>
                        <Collapse
                            expandIconPosition="right"
                            accordion
                            defaultActiveKey="one"
                            expandIcon={({ isActive }) => (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24 "
                                    strokeWidth={5}
                                    stroke="currentColor"
                                    className={classNames("w-4 h-4 text-white-200", {
                                        "rotate-180": isActive,
                                    })}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            )}
                        >
                            <Collapse.Panel
                                key={"one"}
                                className="mt-5 text-xl"
                                header={
                                    <div className="flex items-center ">
                                        <span className=" text-base text-white-200 mr-2 ">
                                            Pool Requests
                                        </span>
                                        <div className="rounded-3xl w-10 bg-white-400  flex text-sm justify-center items-center text-black-400 ">
                                            {poolRequestsProps?.requests?.length || 0}
                                        </div>
                                    </div>
                                }
                            >
                                {poolRequestsProps.requests.length ? (
                                    poolRequestsProps?.requests.map((request, index) => (
                                        <UserRequest
                                            onAccept={(userId) =>
                                                poolRequestsProps.onAccept(request?.id, {
                                                    userId,
                                                    poolId: request.pool_id,
                                                })
                                            }
                                            member={request.user}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col mb-10 justify-center items-center">
                                        <Image
                                            src="/static/images/empty_members.svg"
                                            width="150"
                                            height="150"
                                        />
                                        <span className="text-sm sm:w-full w-2/3 text-white-300">
                                            Your have no request.
                                        </span>
                                    </div>
                                )}
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                )}
                {!status &&
                    offerBoxProps?.isVisible &&
                    !isPoolOwner &&
                    streamService?.streamPlans.map((plan) => (
                        <StreamOptions
                            isSelected={
                                plan.id === selectedPlan?.id ||
                                streamService?.streamPlans.length === 1
                            }
                            plan={plan}
                            onSelectPlan={(plan) => onSelectPlan(plan)}
                        />
                    ))}

                {!status && offerBoxProps?.isVisible && !isPoolOwner && (
                    <SubmitPoolCredentials
                        errors={errors}
                        streamPlan={selectedPlan}
                        show={Boolean(offerBoxProps)}
                        streamService={streamService}
                        onChange={offerBoxProps?.onChange}
                    />
                )}

                {!status && !isPoolOwner && !offerBoxProps?.isVisible && (
                    <div className=" w-full flex justify-start  flex-col items-start my-4 mt-0 i text-white-200 ">
                        <div className="w-full flex mt-2  justify-between">
                            <span className="text-gray-300">Stream Service Name</span>
                            <span className=" font-bold  text-white-200  text-md ">
                                {streamService?.name}
                            </span>
                        </div>
                        <div className="w-full flex mt-2  justify-between">
                            <span className="text-gray-300">No of Subscription Plans</span>
                            <span className=" font-bold  text-white-200  text-md ">
                                {streamService?.streamPlans.length}
                            </span>
                        </div>
                        <div className="w-full flex mt-2  justify-between">
                            <span className="text-gray-300">Billing Period</span>
                            <span className=" font-bold  text-white-200  text-md ">
                                Monthly
                            </span>
                        </div>
                        <div className="w-full flex mt-2  justify-between">
                            <span className="text-gray-300">Price</span>
                            <span className=" font-bold  text-white-200  text-lg ">
                                {selectedPlan?.currency}{" "}
                                {calculateAmount(
                                    selectedPlan?.amount,
                                    selectedPlan?.max_limit
                                )?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
                {renderMainButton()}
            </div>
        </Form>
    );
};

export const ServiceDetailHeader = ({
    title,
    onButtonClick,
}: {
    title: string;
    onButtonClick: () => void;
}) => {
    return (
        <div className="w-full flex mb-10 items-center justify-between text-white-200   ">
            <div className="flex items-center mr-8  ">
                <span className=" text-base   ">{title}</span>
            </div>
            <button
                onClick={() => onButtonClick()}
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
    );
};

export default ServiceDetails;
