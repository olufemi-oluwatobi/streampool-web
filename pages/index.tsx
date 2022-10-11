import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image"
import Link from "next/link";
import ServiceDetails from "../components/ServiceDetails";
import Layout from "../components/Layout";
import StreamServices from "../components/streamServices";
import { useStreamService } from "../providers/streamServiceProvider";
import { Button, Modal, Input } from "antd";
import { StreamPlan } from "../interfaces/index";
import { useAuthContext } from "../providers/authProvider";
import { useNotification } from "../providers/notificationProvider";
import FaqSection from "../components/faq";

const IndexPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);
  const [customEmail, setCustomEmail] = useState<string | null>(null);
  const { authData, verifyUser } = useAuthContext();
  const { triggerNotification } = useNotification();
  const { query } = useRouter();
  const { isLoading, streamService, requestMembership, setStreamService } =
    useStreamService();

  useEffect(() => {
    if (streamService) {
      if (streamService.streamPlans?.length === 1) {
        setSelectedPlan(streamService.streamPlans[0]);
      }
    }
  }, [streamService]);

  const serviceEmail = useMemo(() => {
    if (!authData) return null;
    const email = authData?.user?.emails.find(
      (email) => email.stream_service_id === streamService?.id
    );
    if (!email) return authData?.user?.email;
    return email?.email;
  }, [streamService]);

  useEffect(() => {
    const { token } = query;
    console.log(token, query);
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


  const getMembershipStatus = () => {
    if (!authData) return null;
    const request = authData?.user?.poolRequests?.find(
      (poolRequest) => poolRequest?.stream_service_id === streamService?.id
    );
    if (request) return "pending request";
    const membership = authData?.user?.pools?.find(
      (pool) => pool?.stream_service_id === streamService?.id
    );
    if (membership) return "active membership";
    return null;
  };

  const getCurrentStreamPlan = () => {
    const status = getMembershipStatus();
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

  const getCurrentPool = () => {
    if (!authData) return null;
    const pool = authData?.user?.pools?.find(
      (pool) => pool?.stream_service_id === streamService?.id
    );
    return pool;
  };

  const onCloseModal = () => {
    setStreamService(null);
    setSelectedPlan(null);
    setSubmittingRequest(false);
  };

  return (
    <Layout title="Stream more for less">
      <div className=" flex px-[5%] mt-10 w-full justify-between items-center ">
        <div className="flex flex-col">
          <span className=" text-[36px] lg:text-8xl sm:w-2/3 w-full font-bold mb-10 ">Stream more, For Less</span>
          <div className=" sm:w-fit-content w-full flex justify-start items-center ">
            <Button
              className="  flex justify-center items-center
    w-fit-content bg-[#9ddaad] border-none text-black-500 px-7 py-5 "
            >
              <span>Explore Services</span>
            </Button>
          </div>
        </div>
        <div>
          <Image width={500} height={500} src="/static/images/streamcel_hero_main.svg" />
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
        <div className="flex flex-col justify-center border border-[#999797] p-6 rounded-xl w-screen lg:w-[462px]   bg-[#242424] text-center">
          {!submittingRequest ? (
            <ServiceDetails
              email={serviceEmail}
              streamService={streamService}
              selectedPlan={getCurrentStreamPlan()}
              isLoading={isLoading}
              pool={getCurrentPool()}
              // status="active membership"
              status={getMembershipStatus()}
              onCancel={() => onCloseModal()}
              onSelectPlan={(plan) => setSelectedPlan(plan)}
              onClick={() => setSubmittingRequest(true)}
            />
          ) : (
            <div className="w-full py-4 px-2 modal-input flex flex-col">
              <div className="w-full flex mb-6 items-center justify-between text-white-200   ">
                <div className="flex items-center mr-8  ">
                  <span className=" text-base   ">Request membership</span>
                </div>
                <button
                  onClick={() => onCloseModal()}
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
              <Input
                onChange={(e) => setCustomEmail(e.target.value)}
                className="h-10"
                placeholder="(optional) Enter the email you wish to use for this service"
              />
              <Button
                loading={isLoading}
                onClick={() =>
                  requestMembership({
                    streamServiceId: streamService.id,
                    customEmail,
                  })
                }
                className={
                  "w-full  h-10 mt-6 font-bold border-none  text-md rounded-md text-black-300 bg-[#9DDBAD]  "
                }
              >
                Submit Request
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default IndexPage;
