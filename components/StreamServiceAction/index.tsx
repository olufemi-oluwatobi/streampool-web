import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import PaymentOption from "@components/PaymentOption";
import { useFormik, FormikProvider } from "formik";
import useCheckMobileScreen from "@hooks/useIsMobile";
import StreamServices from "@services/streamServices";
import ServiceDetails, {
  ServiceDetailHeader,
} from "@components/ServiceDetails";
import { InvitationDetailsType } from "@interfaces/index";
import { useStreamService } from "@providers/streamServiceProvider";
import { Button, Modal, Input, Form } from "antd";
import { PoolRequestType, PoolType, StreamPlan } from "@interfaces/index";
import { useAuthContext } from "@providers/authProvider";
import { useNotification } from "@providers/notificationProvider";
import classNames from "classnames";
import * as Yup from "yup";
import StreamOptions from "@components/streamplanOptions";
import streamServices from "@services/streamServices";
const { confirm } = Modal;

const StreamServiceActionPage = ({
  onHeaderClick,
  invitationDetails,
}: {
  onHeaderClick: () => void;
  invitationDetails?: InvitationDetailsType;
}) => {
  const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
  const isMobile = useCheckMobileScreen();
  const [invitationPoolOwner, setInvitationPoolOwner] = useState<string | null>(
    null
  );
  const [editCredentials, setEditCredentials] = useState(false);
  const [modalContentState, setModalContentState] = useState<
    | "init"
    | "requesting_email"
    | "requesting_payment_details"
    | "success"
    | "error"
    | "edit_credentials"
    | "accept_invitation"
  >("init");
  const [isMakingOffer, setMakeOffer] = useState<boolean>(false);
  const [poolRequestObj, setPoolRequestObj] = useState<{
    requestId: number;
    userId: string;
    poolId: number;
    invitationUrl?: string;
  } | null>(null);
  // const [customEmail, setCustomEmail] = useState<string | null>(null);

  const maxMemberCount = useMemo(() => {
    return parseInt(selectedPlan?.max_limit) - 1;
  }, [selectedPlan]);

  useEffect(() => {
    if (invitationDetails) {
      if (invitationDetails.id === streamService.id) {
        const streamPlan = streamService.streamPlans.find(
          (plan) => plan.id === invitationDetails.planId
        );
        setSelectedPlan(streamPlan);
        setInvitationPoolOwner(invitationDetails.owner);
        setModalContentState("requesting_email");
      }
    }
  }, []);

  const {
    authData,
    verifyUser,
    addPaymentDetails,
    fetchUserData,
    isAuthLoading,
    addPoolRequest,
    removePoolRequest,
    updatePoolCredential,
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
    disablePool,
  } = useStreamService();

  const fields = useFormik({
    initialValues: {
      email: "",
      password: "",
      maxMemberCount: maxMemberCount,
      requiresPassword: streamService?.entrance_type === "credentials",
      paymentDate: "",
      type: "general",
    },
    validationSchema: Yup.object().shape({
      requiresPassword: Yup.boolean(),
      email: Yup.string().email().required(),
      maxMemberCount: Yup.number().required(),
      password: Yup.string().when("requiresPassword", {
        is: true,
        then: Yup.string().required("Must enter email address"),
      }),
      paymentDate: Yup.string().required("Next payment date is required"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {},
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
          paymentDate: fields.values.paymentDate,
          type: fields.values.type,
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
        poolId: invitationDetails?.pool,
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

  const submitOffer = async () => {
    try {
      if (!authData) return push("/login?redirect=true");
      const errors = await fields.validateForm();
      if (Object.values(errors).some((d) => Boolean(d))) return;
      await createPool({
        streamServiceId: streamService?.id,
        ...fields.values,
        planId: selectedPlan?.id,
        name: `${authData?.user?.username}-${streamService?.name}`,
      });
      triggerNotification("Request Succesful", "Request Succesful", "success");
      await fetchUserData();
      setModalContentState("init");
      setMakeOffer(false);
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
      if (streamService.streamPlans?.length) {
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

  const credentialField = useFormik({
    initialValues: {
      email:
        currentPool?.poolCredential?.account_email ||
        currentPool?.poolCredential?.email?.email,
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6, "Password is too short"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        credentialField.setSubmitting(true);
        const { data } = await StreamServices.editPoolCredentials(
          currentPool.id,
          {
            password: values.password,
            accountEmail: values.email,
          }
        );
        if (data.success) updatePoolCredential(data.data);

        setModalContentState("init");
        triggerNotification(
          "Membership account credentials update succesful",
          "Membership account credentials update succesful",
          "success"
        );
      } catch (error) {
        const { response } = error;
        if (response) {
          const { data } = response;
          triggerNotification(data.message, data.message, "error");
        }
      } finally {
        credentialField.setSubmitting(true);
      }
    },
  });

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
            title={
              invitationPoolOwner
                ? `Request to join ${invitationPoolOwner}'s ${streamService?.name} membership`
                : "Request to join a membership"
            }
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

  const triggerAcceptRequest = async () => {
    try {
      const { requestId, ...requestObj } = poolRequestObj;
      await acceptRequest(requestId, requestObj);
      triggerNotification(
        "Request Success",
        "User's request has been accepted",
        "success"
      );
      setModalContentState("init");
      setPoolRequestObj(null);
      await fetchUserData();
    } catch (error) {
      triggerNotification(
        "Request Success",
        "User wasn't succesfully added, please try again",
        "error"
      );
    }
  };

  const acceptRequestSection = () => {
    if (!poolRequestObj) return;
    const { requestId } = poolRequestObj;
    const req = authData?.user.membershipRequests.find(
      (d) => d.id === requestId
    );
    return (
      <div className="w-full  modal-input flex flex-col">
        {!isMobile && (
          <ServiceDetailHeader
            title={`Accept ${req?.user?.username} request for ${streamService?.name} membership`}
            onButtonClick={() => onCloseModal()}
          />
        )}
        <Form className="w-full items-center" layout="vertical">
          <Form.Item
            className="mt-4"
            label="Enter invitation link(optional)"
            name="email"
          >
            <Input
              onChange={(e) =>
                setPoolRequestObj((v) => ({
                  ...v,
                  invitationUrl: e.target.value,
                }))
              }
              className="h-10 "
              name="email"
              placeholder="Invitation Link"
            />
          </Form.Item>
        </Form>
        <Button
          loading={isLoading}
          onClick={async () => {
            if (!poolRequestObj) return;
            if (!poolRequestObj?.invitationUrl) {
              confirmAcceptRequest(poolRequestObj);
            } else {
              triggerAcceptRequest();
            }
          }}
          className={
            "w-full h-12 mt-6 font-bold border-none  text-md text-black-700 rounded-3xl bg-white-500  "
          }
        >
          Accept Request
        </Button>
        <Button
          loading={isLoading}
          onClick={() => {
            setModalContentState("init");
            setPoolRequestObj(null);
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

  const confirmAcceptRequest = (d: typeof poolRequestObj) => {
    const { requestId, ...requestData } = d;
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
        triggerAcceptRequest();
      },
    });
  };

  const confirmDisableMembership = () => {
    const pool = authData?.user?.offeredSubs?.find(
      (sub) => sub.stream_service_id === streamService?.id
    );
    confirm({
      title: "Are You sure you want to disable this membership",
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
          await disablePool(pool.id);
          triggerNotification("Request Success", "Pool Disabled", "success");
          await fetchUserData();
        } catch (error) {
          triggerNotification(
            "Request Sucesss",
            "User wasn't succesfully added, please try again",
            "error"
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
        isPoolOwner ? confirmDisableMembership() : setMakeOffer(false);
      },
      label: isPoolOwner ? "Disable Membership" : "Cancel",
      className: "bg-[#BA1200] text-white-400 font-bold border-none w-full",
    };

    if (isMakingOffer) return [makeOwner, cancelButtonProps];
    if (!isPoolOwner && !membershipStatus)
      return [makeOwner, isRequestButtonProps];
    if (isPoolOwner) return cancelButtonProps;
    else return isRequestButtonProps;
  }, [authData, streamService, isMakingOffer, fields]);

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
                triggerEdit={() => setModalContentState("edit_credentials")}
                email={serviceEmail}
                errors={fields.errors}
                streamService={streamService}
                selectedPlan={getCurrentStreamPlan()}
                isLoading={isLoading || isAuthLoading}
                pool={currentPool}
                poolRequestsProps={{
                  requests: authData?.user.membershipRequests,
                  onAccept: (requestId, d) => {
                    setPoolRequestObj({ requestId, ...d });
                    setModalContentState("accept_invitation");
                  },
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
      case "edit_credentials":
        return (
          <FormikProvider value={credentialField}>
            <Form className="w-full items-center" layout="vertical">
              <Form.Item>
                <span className="text-white-200 text-xl">
                  Update {streamService?.name} Account Details
                </span>
              </Form.Item>
              <Form.Item
                validateStatus={
                  credentialField.errors?.email ? "error" : "success"
                }
                help={
                  credentialField.errors?.email && credentialField.errors?.email
                }
                label="Membership Email Address"
              >
                <Input
                  className="h-10"
                  name="email"
                  onChange={credentialField.handleChange}
                  placeholder="Enter membership's email address"
                  value={credentialField.values.email}
                />
              </Form.Item>
              <Form.Item
                validateStatus={
                  credentialField.errors?.password ? "error" : "success"
                }
                help={
                  credentialField.errors?.password &&
                  credentialField.errors?.password
                }
                label="Membership Password"
                name="password"
              >
                <Input
                  value={credentialField.values.password}
                  className="h-10 "
                  name="password"
                  onChange={credentialField.handleChange}
                  placeholder="Enter membership's password"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex w-full justify-end items-center">
                  <Button
                    disabled={credentialField.isSubmitting}
                    onClick={() => setModalContentState("init")}
                    className=" font-medium "
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => credentialField.handleSubmit()}
                    loading={credentialField.isSubmitting}
                    disabled={credentialField.isSubmitting}
                    className="ml-2 font-medium border-none bg-[#49DE80]"
                  >
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </FormikProvider>
        );
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
                onClose: () => {},
              });
              if (authData?.paymentDetails) {
                submitRequest();
              } else {
                setModalContentState("requesting_payment_details");
              }
            }}
          />
        );
      case "accept_invitation":
        return acceptRequestSection();
    }
  };

  return renderContent();
};

export default StreamServiceActionPage;
