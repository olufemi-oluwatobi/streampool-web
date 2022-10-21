import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PaymentOption from "@components/PaymentOption";
import { useFormik, FormikProvider } from "formik";
import Image from "next/image";
import Link from "next/link";
import ServiceDetails from "../components/ServiceDetails";
import Layout from "../components/Layout";
import StreamServices from "../components/streamServices";
import { useStreamService } from "../providers/streamServiceProvider";
import { Button, Modal, Input } from "antd";
import { PoolRequestType, PoolType, StreamPlan } from "../interfaces/index";
import { useAuthContext } from "../providers/authProvider";
import { useNotification } from "../providers/notificationProvider";
import FaqSection from "../components/faq";
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
  const fields = useFormik({
    initialValues: {
      email: "",
      password: "",
      maxMemberCount: parseInt(selectedPlan?.max_limit) - 1,
    },
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
  } = useStreamService();

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
    console.log(fields);
    try {
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

  useEffect(() => {
    const { token } = query;
    if (token) {
      verifyUser(token as string, {
        onSuccess: () => {
          console.log("successful");
          triggerNotification(
            "Verification Success",
            "Your account has been verified",
            "success"
          );
        },
        onError: () => {
          console.log("error");
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
    return "Request to Join a Pool";
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
        "text-[#BA1200] text-black-500 font-bold border-none w-fit-content h-fit-content bg-transparent":
          membershipStatus === "active membership",
      }),
    };

    const makeOwner = {
      onClick: () => {
        !isMakingOffer ? setMakeOffer(true) : submitOffer();
      },
      label: isMakingOffer ? "Submit" : "Make a Subscription Pool",
      className: classNames("bg-black-700 text-white-200 font-bold"),
    };

    const cancelButtonProps = {
      onClick: () => {
        setMakeOffer(false);
      },
      label: isPoolOwner ? "Disable Pool" : "Cancel",
      className: classNames({
        "bg-white-200 text-black-500 font-bold": !isPoolOwner,
        "text-[#BA1200] text-black-500 font-bold border-none w-fit-content h-fit-content bg-transparent":
          isPoolOwner,
      }),
    };

    if (isMakingOffer) return [makeOwner, cancelButtonProps];
    if (!isPoolOwner && !membershipStatus)
      return [isRequestButtonProps, makeOwner];
    if (isPoolOwner) return cancelButtonProps;
    else return isRequestButtonProps;
  }, [authData, streamService, isMakingOffer]);

  const renderModalContent = () => {
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
      <div className=" flex sm:flex-row flex-col px-[5%] mt-10 w-full justify-between items-center ">
        <div className="flex flex-col sm:bg-transparent  rounded-xl  text-white-200 ">
          <span className=" text-[46px] leading-tight md:text-[46px] lg:text-[66px] xl:text-[76px] 2xl:text-[86px] sm:w-2/3 w-full font-bold sm:mb-2 mb-2 ">
            Stream More, for Less
          </span>
          <span className="my-6 text-[#a9abb1] text-md w-full lg:w-3/4 xl:w-3/4 2xl:w-3/4 leading-loose sm:font-medium font-bold  ">
            Feel like you're missing out on a great deal of shows cos there are
            so many streaming services and you can't afford them all? Not to
            worry, we've got you covered. Streamcel allows you to save money on
            streaming by sharing subscriptions with other users.
          </span>
          <div className=" sm:w-fit-content  w-full flex justify-start items-center ">
            <Button
              className="  flex justify-center rounded-lg items-center
    w-fit-content bg-[#49DE80]  font-bold border-none text-black-500 px-7 py-5 "
            >
              <span>Explore Services</span>
            </Button>
          </div>
        </div>
        <div className="sm:mt-0 mt-20 flex ">
          <Image
            width={800}
            height={800}
            src="/static/images/streamcel_hero_main_3.svg"
          />
        </div>
      </div>
      {/* <Banner {...bannerButtonContent} /> */}
      <section
        id="card_content_wrapper"
        className=" w-full px-[5%] flex flex-col     "
      >
        <section className="flex">
          <StreamServices />
        </section>
        <section className=" my-10 ">
          <FaqSection />
        </section>
        <section className="flex w-full sm:p-10 p-5 flex-wrap    mb-20 justify-between  items-center bg-[#8F3985] rounded-2xl">
          <div className="flex flex-col">
            <span className="font-bold text-[#FDFDFF] text-3xl ">
              Still have questions?
            </span>
            <span className=" sm:w-2/3 w-full mt-5 ">
              Can't find the answer your're looking for? please chat with our
              friendly team through the chat box or send us an email.
            </span>
          </div>
          <div className="px-4 sm:mt-0 mt-5  py-2 rounded-xl bg-[#FDFDFF]">
            <Link className="text-black-400" href="/">
              <span className=" text-black-400">Get In Touch</span>
            </Link>
          </div>
        </section>
      </section>
      <Modal
        className=" rounded-lg "
        cancelButtonProps={{ style: { display: "none" } }}
        visible={Boolean(streamService)}
        footer={null}
        destroyOnClose={true}
        closable={false}
      >
        <div className="flex flex-col justify-center border border-[#999797] p-6 rounded-xl w-screen lg:w-[500px] overflow-auto   bg-[#242424] text-center">
          {renderModalContent()}
        </div>
      </Modal>
    </Layout>
  );
};

export default IndexPage;
