import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import HeaderBanner from "@components/pageBanner";
import Image from "next/image";
import useCheckMobileScreen from "@hooks/useIsMobile";
import { PoolRequestType, PoolType } from "../interfaces/index";
import className from "classnames";
import { calculateAmount } from "@utils/helpers";
import { ServiceCard } from "../components/ServiceCard";
import StreamServiceActionPage from "@components/StreamServiceAction";
import Layout from "../components/Layout";
import { useStreamService } from "../providers/streamServiceProvider";
import { Modal } from "antd";
import { StreamPlan } from "../interfaces/index";
import { useAuthContext } from "../providers/authProvider";
import { useNotification } from "../providers/notificationProvider";

import withAuth from "../utils/auth/withAuth";

const EmptyState = () => {
  return (
    <div className="flex flex-col mt-20 justify-center items-center">
      <Image
        width="150"
        height="150"
        src="/static/images/membership_empty_4.svg"
      ></Image>
      <span className=" text-[#898e92] mt-[-20px] text-sm ">
        Oops, You have no active membership
      </span>
    </div>
  );
};
const IndexPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
  const { authData, verifyUser } = useAuthContext();
  const { triggerNotification } = useNotification();
  const isMobile = useCheckMobileScreen();
  const { query, push } = useRouter();
  const {
    isLoading,
    streamService,
    requestMembership,
    streamServices,
    setStreamService,
  } = useStreamService();

  const services = useMemo(() => {
    let requests = authData?.user?.pools
      ?.map((pool) =>
        streamServices.find((service) => service.id === pool.stream_service_id)
      )
      .filter((d) => Boolean(d));
    let poolsOwned = authData?.user?.offeredSubs
      ?.map((pool) =>
        streamServices.find((service) => service.id === pool.stream_service_id)
      )
      .filter((d) => Boolean(d));
    poolsOwned = poolsOwned || [];
    requests = requests || [];
    return _.uniqBy([...requests, ...poolsOwned], "id");
  }, [authData, streamServices]);

  useEffect(() => {
    if (streamService) {
      if (streamService.streamPlans?.length === 1) {
        setSelectedPlan(streamService.streamPlans[0]);
      }
    }
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

  const serviceMembership = useMemo<PoolType | null>(() => {
    if (!authData) return null;
    return authData?.user?.pools?.find(
      (pool) => pool?.stream_service_id === streamService?.id
    );
  }, [authData, streamService]);

  const membershipStatus = useMemo(() => {
    if (serviceRequest) return "pending request";
    if (serviceMembership) return "active membership";
    return null;
  }, [serviceRequest, serviceMembership]);

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

  const onCloseModal = () => {
    setStreamService(null);
    setSelectedPlan(null);
  };

  const getCurrentPool = () => {
    if (!authData) return null;
    const pool = authData?.user?.pools?.find(
      (pool) => pool?.stream_service_id === streamService?.id
    );
    return pool;
  };

  const serviceEmail = useMemo(() => {
    if (!authData) return null;
    const email = authData?.user?.emails?.find(
      (email) => email.stream_service_id === streamService?.id
    );
    if (!email) return authData?.user?.email;
    return email?.email;
  }, [streamService]);

  return (
    <Layout title="Creating Happiness">
      <HeaderBanner title={"Memberships"} />
      <section
        id="card_content_wrapper"
        className=" w-full mt-2 mb-40 px-[5%] flex flex-col justify-center items-center     "
      >
        <section className="flex w-full justify-center items-center">
          {services && services?.length ? (
            <div
              className={
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2x:grid-cols-4 gap-8 md:gap-2 lg:gap-12"
              }
            >
              {services?.length
                ? isLoading === false &&
                  services?.map((service) => (
                    <div
                      className={className(" sm:ml-0 sm:min-w-0 min-w-[270px]")}
                    >
                      <ServiceCard
                        buttonProp={{
                          label: "View Membership",
                          onClick: () => {
                            setStreamService(service);
                            if (isMobile) push(`/stream_service/${service.id}`);
                          },
                        }}
                        currency={service?.streamPlans[0]?.currency}
                        image={service?.icon}
                        name={service?.name}
                        type="Audio Streaming Service"
                        amount={calculateAmount(
                          service?.streamPlans[0]?.amount,
                          service?.streamPlans[0]?.max_limit
                        )}
                        oldAmount={service?.streamPlans[0]?.amount}
                        key={`gift-card-key-${Math.random()}`}
                      />
                    </div>
                  ))
                : ""}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </section>
      {!isMobile && (
        <Modal
          className=" rounded-lg "
          cancelButtonProps={{ style: { display: "none" } }}
          visible={Boolean(streamService)}
          footer={null}
          destroyOnClose={true}
          closable={true}
        >
          <div
            style={{
              boxShadow:
                "rgb(255 255 255 / 20%) 0px 0px 15px, rgb(255 255 255 / 15%) 0px 0px 3px 1px",
            }}
            className="flex flex-col drop-shadow-2xl bg-black-700 justify-center border border-[#999797] p-6 rounded-xl w-screen lg:w-[500px] overflow-auto  text-center"
          >
            <StreamServiceActionPage onHeaderClick={() => onCloseModal()} />
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default withAuth(IndexPage, false);
