import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PaymentOption from "@components/PaymentOption";
import { useFormik, FormikProvider } from "formik";
import useCheckMobileScreen from "@hooks/useIsMobile";
import Image from "next/image";
import Link from "next/link";
import StreamServiceActionPage from "@components/StreamServiceAction";
import ServiceDetails, {
  ServiceDetailHeader,
} from "../components/ServiceDetails";
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
  const isMobile = useCheckMobileScreen();
  const [modalContentState, setModalContentState] = useState<
    | "init"
    | "requesting_email"
    | "requesting_payment_details"
    | "success"
    | "error"
  >("init");
  const [isMakingOffer, setMakeOffer] = useState<boolean>(false);

  const maxMemberCount = useMemo(() => {
    return parseInt(selectedPlan?.max_limit) - 1;
  }, [selectedPlan]);

  const { authData } = useAuthContext();
  const {
    streamService,

    setStreamService,
  } = useStreamService();

  useEffect(() => {
    if (streamService) {
      if (streamService.streamPlans?.length === 1) {
        setSelectedPlan(streamService.streamPlans[0]);
      }
    }
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

  const onCloseModal = () => {
    setStreamService(null);
    setSelectedPlan(null);
    setMakeOffer(null);
  };

  return (
    <Layout title="Stream more for less">
      <div className=" flex sm:flex-row flex-col px-[5%] mt-10 w-full justify-between items-center ">
        <div className="flex flex-col sm:bg-transparent  rounded-xl  text-white-200 ">
          <span className=" text-[46px] leading-tight md:text-[46px] lg:text-[66px] xl:text-[76px] 2xl:text-[86px] sm:w-2/3 w-full font-bold sm:mb-2 mb-2 ">
            Stream More, for Less
          </span>
          <span className="my-6 text-[#95999c] text-base w-full lg:w-3/4 xl:w-3/4 2xl:w-3/4 leading-loose text-justify sm:font-medium font-normal ">
            Feel like you're losing out on a lot of shows because there are so
            many streaming services to choose from and you can't afford them
            all? Not to worry, we've got your back. By sharing subscriptions
            with other users, you can save money on streaming.
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
      {!isMobile && (
        <Modal
          className=" rounded-lg "
          cancelButtonProps={{ style: { display: "none" } }}
          visible={!isMobile && Boolean(streamService)}
          footer={null}
          destroyOnClose={true}
          closable={false}
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

export default IndexPage;
