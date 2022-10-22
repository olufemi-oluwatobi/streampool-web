import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PaymentOption from "@components/PaymentOption";
import { useFormik, FormikProvider } from "formik";
import Image from "next/image";
import ServiceDetails from "@components/ServiceDetails";
import Layout from "@components/Layout";
import { useStreamService } from "@providers/streamServiceProvider";
import { Button, Modal, Input } from "antd";
import { PoolRequestType, PoolType, StreamPlan } from "@interfaces/index";
import { useAuthContext } from "@providers/authProvider";
import { useNotification } from "@providers/notificationProvider";
import classNames from "classnames";

const { confirm } = Modal;

const IndexPage = () => {
    const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
    const [modalContentState, setModalContentState] = useState<
        | "init"
        | "requesting_email"
        | "requesting_payment_details"
        | "success"
        | "error"
    >("init");
    const [isMakingOffer, setMakeOffer] = useState<boolean>(false);
    const [customEmail, setCustomEmail] = useState<string | null>(null);

    const maxMemberCount = useMemo(() => {
        return parseInt(selectedPlan?.max_limit) - 1;
    }, [selectedPlan]);

    const fields = useFormik({
        initialValues: {
            email: "",
            password: "",
            maxMemberCount: maxMemberCount,
        },
        enableReinitialize: true,
        onSubmit: async (values) => { },
    });
    const {
        authData,
        verifyUser,
        addPaymentDetails,
        fetchUserData,
        isAuthLoading,
    } = useAuthContext();
    const { triggerNotification } = useNotification();
    const { query, push } = useRouter();
    const {
        isLoading,
        streamService,
        requestMembership,
        createPool,
        setStreamService,
        cancelRequest,
        streamServices
    } = useStreamService();

    const { id } = query

    useEffect(() => {
        if (streamServices && id) {
            const service = streamServices.find(service => service.id === parseInt(id as string, 10))
            if (service) {
                setStreamService(service)
            }
        }
    }, [streamServices])
    const submitRequest = async () => {
        try {
            await requestMembership({
                streamServiceId: streamService.id,
                customEmail,
            });
            triggerNotification("Request Succesful", "Request Succesful", "success");
            await fetchUserData();
            setModalContentState("init");
        } catch (error) {
            setModalContentState("error");
        }
    };

    const submitOffer = async () => {
        try {
            if (!authData) return push("/login");
            await createPool({
                streamServiceId: streamService.id,
                email: fields.values.email,
                planId: selectedPlan.id,
                maxMemberCount: fields.values.maxMemberCount,
                password: fields.values.password,
                name: `${authData?.user?.username}-${streamService?.name}`,
            });
            triggerNotification("Request Succesful", "Request Succesful", "success");
            await fetchUserData();
            setModalContentState("init");
        } catch (error) {
            triggerNotification(
                "Request Error",
                "Sorry, Failed to submit request, kindly try again",
                "error"
            );
            //setModalContentState("error");
        }
    };

    const onRequestCancel = async () => {
        try {
            await cancelRequest(serviceRequest.id);
            triggerNotification("Request Cancelled", "Request Cancelled", "success");
            await fetchUserData();
            setModalContentState("init");
        } catch (error) {
            setModalContentState("error");
        }
    };

    useEffect(() => {
        if (streamService) {
            if (streamService.streamPlans?.length === 1) {
                setSelectedPlan(streamService.streamPlans[0]);
            }
        }
    }, [streamService]);

    const serviceEmail = useMemo(() => {
        if (!authData) return null;
        const email = authData?.user?.emails?.find(
            (email) => email.stream_service_id === streamService?.id
        );
        if (!email) return authData?.user?.email;
        return email?.email;
    }, [streamService]);

    const serviceRequest = useMemo<PoolRequestType | null>(() => {
        if (!authData) return null;
        const request = authData?.user?.poolRequests?.find(
            (poolRequest) =>
                poolRequest?.stream_service_id === streamService?.id &&
                poolRequest.status === "pending"
        );
        return request;
    }, [authData, streamService]);

    const isPoolOwner = useMemo(() => {
        return authData?.user?.offeredSubs?.some(
            (sub) => sub.stream_service_id === streamService?.id
        );
    }, [authData, streamService]);

    const serviceMembership = useMemo<PoolType | null>(() => {
        if (!authData) return null;
        return authData?.user?.pools?.find(
            (pool) => pool?.stream_service_id === streamService?.id
        );
    }, [authData, streamService]);

    const membershipStatus = useMemo(() => {
        if (serviceMembership) return "active membership";
        if (serviceRequest) return "pending request";
        return null;
    }, [authData, serviceRequest, serviceMembership]);

    const getCurrentStreamPlan = () => {
        const status = membershipStatus;
        if (!status) return selectedPlan;
        if (status === "pending request") {
            const plan = streamService.streamPlans[0];
            return plan;
        }
        if (status === "active membership") {
            const pool = authData?.user?.pools?.find(
                (pool) => pool?.stream_service_id === streamService?.id
            );
            const plan = streamService.streamPlans.find(
                (plan) => plan.id === pool.stream_plan_id
            );
            return plan;
        }
    };

    const currentPool = useMemo(() => {
        if (!authData) return null;
        if (isPoolOwner) {
            return authData?.user?.offeredSubs.find(
                (pool) => pool?.stream_service_id === streamService?.id
            );
        }
        const pool = authData?.user?.pools?.find(
            (pool) => pool?.stream_service_id === streamService?.id
        );
        return pool;
    }, [authData, streamService]);

    const onCloseModal = () => {
        setStreamService(null);
        setSelectedPlan(null);
        setMakeOffer(null)
    };

    const requestEmail = () => {
        return (
            <div className="w-full py-4 px-2 modal-input flex flex-col">
                <div className="w-full flex mb-6 items-center justify-between text-white-200   ">
                    <div className="flex items-center mr-8  ">
                        <button
                            onClick={() => setModalContentState("init")}
                            className=" outline-none bg-none mr-4  w-6 h-6 justify-center items-center bg-[#444444] flex rounded-full "
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
                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>
                        <span className=" text-base   ">
                            Add your {streamService.name} membership email
                        </span>
                    </div>
                </div>
                <Input
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="h-10"
                    placeholder="(optional) Enter the email you wish to use for this service"
                />
                <Button
                    loading={isLoading}
                    onClick={() => {
                        if (!authData) {
                            push("/login");
                        }
                        if (authData.paymentDetails) {
                            submitRequest();
                        } else {
                            setModalContentState("requesting_payment_details");
                        }
                    }}
                    className={
                        "w-full  h-10 mt-6 font-bold border-none  text-md rounded-md text-black-300 bg-[#9DDBAD]  "
                    }
                >
                    Submit Request
                </Button>
            </div>
        );
    };

    const detailButtonLabel = useMemo(() => {
        if (serviceMembership) return "Cancel Membership";
        if (serviceRequest) return "Cancel Request";
        return "Join a pool";
    }, [authData, serviceRequest, serviceMembership]);

    const showCancelRequestConfirm = () => {
        confirm({
            title: "Are you sure you want to cancel your request",
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
                onRequestCancel();
            },
        });
    };

    const buttonProps = useMemo(() => {
        const isRequestButtonProps = {
            onClick: () =>
                membershipStatus === "pending request"
                    ? showCancelRequestConfirm()
                    : setModalContentState("requesting_email"),
            label: detailButtonLabel,
            className: classNames("bg-white-200 text-black-500", {
                "font-bold": !membershipStatus,
                " font-bold  w-full text-black-500":
                    membershipStatus === "pending request",
                "text-[#BA1200] text-black-500 font-bold border-none w-full bg-transparent":
                    membershipStatus === "active membership",
            }),
        };

        const setMakePool = () => {
            if (!authData) return push("/login");
            setMakeOffer(true);
        };

        const makeOwner = {
            onClick: () => {
                !isMakingOffer ? setMakePool() : submitOffer();
            },
            label: isMakingOffer ? "Submit" : "Create a pool",
            className: classNames(" bg-white-200 border border-solid border-[#999797]  w-full font-bold", { "bg-transparent text-white-200 font-bold": !isMakingOffer }),
        };

        const cancelButtonProps = {
            onClick: () => {
                setMakeOffer(false);
            },
            label: isPoolOwner ? "Disable Pool" : "Cancel",
            className: "bg-[#BA1200] text-white-400 font-bold border-none w-full"
        };

        if (isMakingOffer) return [makeOwner, cancelButtonProps];
        if (!isPoolOwner && !membershipStatus)
            return [isRequestButtonProps, makeOwner];
        if (isPoolOwner) return cancelButtonProps;
        else return isRequestButtonProps;
    }, [authData, streamService, isMakingOffer]);

    const renderContent = () => {
        switch (modalContentState) {
            case "init":
                return (
                    <FormikProvider value={fields}>
                        <ServiceDetails
                            email={serviceEmail}
                            streamService={streamService}
                            selectedPlan={getCurrentStreamPlan()}
                            isLoading={isLoading || isAuthLoading}
                            pool={currentPool}
                            isPoolOwner={isPoolOwner}
                            buttonProps={buttonProps}
                            offerBoxProps={{
                                isVisible: isMakingOffer,
                                onChange: (e) => {
                                    console.log(e.target.value, e.target.name);
                                    fields.handleChange(e);
                                    console.log(fields.values);
                                },
                            }}
                            // status="active membership"
                            status={membershipStatus}
                            onCancel={() => onCloseModal()}
                            onSelectPlan={(plan) => setSelectedPlan(plan)}
                        />
                    </FormikProvider>
                );
            case "requesting_email":
                return requestEmail();
            case "requesting_payment_details":
                return (
                    <PaymentOption
                        isLoading={isLoading}
                        onCancel={() => onCloseModal()}
                        onClick={() => {
                            if (!authData) {
                                return push("/login");
                            }
                            addPaymentDetails(50, {
                                onSuccess: () => {
                                    console.log("in here");
                                    setModalContentState("init");
                                    submitRequest();
                                },
                                onClose: () => console.log("close"),
                            });
                            if (authData.paymentDetails) {
                                submitRequest();
                            } else {
                                setModalContentState("requesting_payment_details");
                            }
                        }}
                    />
                );
        }
    };

    return (
        <Layout title="Stream more for less">
            <div className="h-full flex justify-between flex-col">
                {streamService && <Image src={streamService?.icon || ""} width="700" height="300" objectFit='cover' />}

                <div className=" flex sm:flex-row px-[2%] flex-col mt-10 h-full w-full justify-between items-center ">
                    {renderContent()}
                </div>

            </div>
        </Layout>
    );
};

export default IndexPage;
