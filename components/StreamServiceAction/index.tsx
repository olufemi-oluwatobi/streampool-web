import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import PaymentOption from "@components/PaymentOption";
import { useFormik, FormikProvider } from "formik";
import useCheckMobileScreen from "@hooks/useIsMobile";
import ServiceDetails, {
    ServiceDetailHeader,
} from "@components/ServiceDetails";
import { useStreamService } from "@providers/streamServiceProvider";
import { Button, Modal, Input, Form } from "antd";
import { PoolRequestType, PoolType, StreamPlan } from "@interfaces/index";
import { useAuthContext } from "@providers/authProvider";
import { useNotification } from "@providers/notificationProvider";
import classNames from "classnames";
import * as Yup from "yup";
import StreamOptions from "@components/streamplanOptions";
const { confirm } = Modal;

const StreamServiceActionPage = ({
    onHeaderClick,
}: {
    onHeaderClick: () => void;
}) => {
    const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
    const isMobile = useCheckMobileScreen();
    const [modalContentState, setModalContentState] = useState<
        | "init"
        | "requesting_email"
        | "requesting_payment_details"
        | "success"
        | "error"
    >("init");
    const [isMakingOffer, setMakeOffer] = useState<boolean>(false);
    // const [customEmail, setCustomEmail] = useState<string | null>(null);

    const maxMemberCount = useMemo(() => {
        return parseInt(selectedPlan?.max_limit) - 1;
    }, [selectedPlan]);

    const {
        authData,
        verifyUser,
        addPaymentDetails,
        fetchUserData,
        isAuthLoading,
        addPoolRequest,
        removePoolRequest,
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
        acceptRequest,
    } = useStreamService();


    const fields = useFormik({
        initialValues: {
            email: "",
            password: "",
            maxMemberCount: maxMemberCount,
            requiresPassword: streamService?.entrance_type === "credentials",
        },
        validationSchema: Yup.object().shape({
            requiresPassword: Yup.boolean(),
            email: Yup.string().email().required(),
            maxMemberCount: Yup.number().required(),
            password: Yup.string().when("requiresPassword", {
                is: true,
                then: Yup.string().required("Must enter email address"),
            }),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => { },
    });

    const customEmailFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email(),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (!authData) return push("/login?redirect=true");
                await createPool({
                    streamServiceId: streamService.id,
                    email: fields.values.email,
                    planId: selectedPlan.id,
                    maxMemberCount: fields.values.maxMemberCount,
                    password: fields.values.password,
                    name: `${authData?.user?.username}-${streamService?.name}`,
                });
                triggerNotification(
                    "Request Succesful",
                    "Request Succesful",
                    "success"
                );
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
        },
    });

    const submitRequest = async () => {
        try {
            const data = await requestMembership({
                streamServiceId: streamService.id,
                customEmail: customEmailFormik.values.email,
            });
            if (data) {
                addPoolRequest(data?.data?.data);
            }
            triggerNotification("Request Succesful", "Request Succesful", "success");
            setModalContentState("init");
        } catch (error) {
            setModalContentState("error");
        }
    };


    const submitOffer = useCallback(async () => {
        try {
            if (!authData) return push("/login?redirect=true");
            const errors = await fields.validateForm();
            if (Object.values(errors).some((d) => Boolean(d))) return;
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
            setMakeOffer(false)
        } catch (error) {
            triggerNotification(
                "Request Error",
                "Sorry, Failed to submit request, kindly try again",
                "error"
            );
            //setModalContentState("error");
        }
    }, [authData]);

    const onRequestCancel = async () => {
        try {
            const id = await cancelRequest(serviceRequest.id);
            if (id) {
                removePoolRequest(id);
            }
            triggerNotification("Request Cancelled", "Request Cancelled", "success");
            setModalContentState("init");
        } catch (error) {
            triggerNotification(
                "Sorry! Failed to complete request",
                "Sorry! Failed to complete request",
                "error"
            );
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

    useEffect(() => {
        const { token } = query;
        if (token) {
            verifyUser(token as string, {
                onSuccess: () => {
                    triggerNotification(
                        "Verification Success",
                        "Your account has been verified",
                        "success"
                    );
                },
                onError: () => {
                    triggerNotification("Verification Error", "Invalid Token", "error");
                },
            });
        }
    }, [query]);

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
        setMakeOffer(null);
    };

    const requestEmail = () => {
        return (
            <div className="w-full  modal-input flex flex-col">
                {!isMobile && (
                    <ServiceDetailHeader
                        title="Select Email"
                        onButtonClick={() => onCloseModal()}
                    />
                )}
                <span className="mb-2">Select a plan</span>
                {streamService?.streamPlans?.map((plan) => (
                    <StreamOptions
                        isSelected={selectedPlan?.id === plan.id}
                        plan={plan}
                        onSelectPlan={() => setSelectedPlan(plan)}
                    />
                ))}

                <Form className="w-full items-center" layout="vertical">
                    <Form.Item
                        className="mt-4"
                        validateStatus={
                            customEmailFormik.errors?.email ? "error" : "success"
                        }
                        help={
                            customEmailFormik.errors?.email && customEmailFormik.errors?.email
                        }
                        label="Enter membership email address"
                        name="email"
                    >
                        <Input
                            onChange={(e) => customEmailFormik.handleChange(e)}
                            className="h-10 "
                            name="email"
                            placeholder="Enter membership email address"
                        />
                    </Form.Item>
                </Form>
                <Button
                    loading={isLoading}
                    onClick={() => {
                        if (!authData) {
                            push("/login?redirect=true");
                        }
                        if (authData?.paymentDetails) {
                            submitRequest();
                        } else {
                            setModalContentState("requesting_payment_details");
                        }
                    }}
                    className={
                        "w-full h-12 mt-6 font-bold border-none  text-md text-black-700 rounded-3xl bg-white-500  "
                    }
                >
                    Submit Request
                </Button>
                <Button
                    loading={isLoading}
                    onClick={() => {
                        setModalContentState("init");
                    }}
                    className={
                        "w-full h-12 mt-2 font-bold border-none  text-md text-white-300 rounded-3xl bg-black-700  "
                    }
                >
                    Cancel
                </Button>
            </div>
        );
    };

    const detailButtonLabel = useMemo(() => {
        if (serviceMembership) return "Cancel membership";
        if (serviceRequest) return "Cancel Request";
        return "Request a membership";
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

    const confirmAcceptRequest = (
        requestId: number,
        d: { userId: string; poolId: number }
    ) => {
        confirm({
            title: "Are you sure you've added the user's email to your membership?",
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
            async onOk() {
                try {
                    const user = await acceptRequest(requestId, d);
                    triggerNotification(
                        "Request Sucess",
                        "User's request has been accepted",
                        "success"
                    );
                    await fetchUserData();
                } catch (error) {
                    triggerNotification(
                        "Request Sucess",
                        "User wasn't succesfully added, please try again",
                        "success"
                    );
                }
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
            className: classNames(
                " border border-solid border-[#999797] bg-black-700  text-white-200 font-bold",
                {
                    "text-[#BA1200] text-black-500 font-bold border-none w-full bg-transparent":
                        membershipStatus === "active membership",
                }
            ),
        };

        const setMakePool = () => {
            if (!authData) return push("/login?redirect=true");
            setMakeOffer(true);
        };

        const makeOwner = {
            onClick: () => {
                !isMakingOffer ? setMakePool() : submitOffer();
            },
            label: isMakingOffer ? "Submit Membership" : "Share a membership",
            className: classNames(
                " border border-solid border-[#999797] w-full font-bold",
                { " bg-white-400  text-black-700": !isMakingOffer },
                { "bg-white-200 text-black-400": isMakingOffer }
            ),
        };

        const cancelButtonProps = {
            onClick: () => {
                setMakeOffer(false);
            },
            label: isPoolOwner ? "Disable Membership" : "Cancel",
            className: "bg-[#BA1200] text-white-400 font-bold border-none w-full",
        };

        if (isMakingOffer) return [makeOwner, cancelButtonProps];
        if (!isPoolOwner && !membershipStatus)
            return [makeOwner, isRequestButtonProps];
        if (isPoolOwner) return cancelButtonProps;
        else return isRequestButtonProps;
    }, [authData, streamService, isMakingOffer]);

    const renderContent = () => {
        switch (modalContentState) {
            case "init":
                return (
                    <FormikProvider value={fields}>
                        <div className="w-full">
                            {!isMobile && (
                                <ServiceDetailHeader
                                    title="Membership"
                                    onButtonClick={() => onCloseModal()}
                                />
                            )}
                            <ServiceDetails
                                email={serviceEmail}
                                errors={fields.errors}
                                streamService={streamService}
                                selectedPlan={getCurrentStreamPlan()}
                                isLoading={isLoading || isAuthLoading}
                                pool={currentPool}
                                poolRequestsProps={{
                                    requests: authData?.user.membershipRequests,
                                    onAccept: (requestId, d) =>
                                        confirmAcceptRequest(requestId, d),
                                }}
                                isPoolOwner={isPoolOwner}
                                buttonProps={buttonProps}
                                offerBoxProps={{
                                    isVisible: isMakingOffer,
                                    onChange: (e) => {
                                        fields.handleChange(e);
                                    },
                                }}
                                // status="active membership"
                                status={membershipStatus}
                                onCancel={() => onCloseModal()}
                                onSelectPlan={(plan) => setSelectedPlan(plan)}
                            />
                        </div>
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
                                return push("/login?redirect=true");
                            }
                            addPaymentDetails(50, {
                                onSuccess: () => {
                                    setModalContentState("init");
                                    submitRequest();
                                },
                                onClose: () => { },
                            });
                            if (authData?.paymentDetails) {
                                submitRequest();
                            } else {
                                setModalContentState("requesting_payment_details");
                            }
                        }}
                    />
                );
        }
    };

    return <FormikProvider value={fields}>{renderContent()}</FormikProvider>;
};

export default StreamServiceActionPage;
