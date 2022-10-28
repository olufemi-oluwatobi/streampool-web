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

type Steps = { heading: string; content: string };
const HowItWorks = () => {
  const steps: Array<Steps> = [
    {
      heading: "Select a Stream Service",
      content:
        "We provide a variety of streaming options that might meet your demands, whether you want to view a movie or listen to your favorite singer.",
    },
    {
      heading: "Request or Share a Membership",
      content:
        "If you have an active membership, you can list it for sharing. If you want to join a membership, simply submit a membership request and you'll be added to a membership ASAP. You will only be charged a portion of the real subscription cost of the stream service that you subscribed to.",
    },
    {
      heading: "Enjoy More Streaming!",
      content:
        "Now you can get more services at a lower cost. Membership owners will receive shared subscription costs at the end of each month.",
    },
  ];
  const scrollToComponent = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="w-full mt-20 justify-center items-center flex flex-col">
      <span className=" font-bold mb-4 text-3xl ">How Does It Work?</span>
      <div className="w-full  flex sm:flex-row flex-col justify-between items-start">
        {steps.map((step, index) => (
          <div className="flex mt-10 sm:px-10  justify-end items-center flex-col">
            <div className="rounded-full sm:h-32 h-20 sm:w-32 w-20 mb-10 border-2 border-[#5f6163]  border-solid flex justify-center items-center">
              <span className=" font-bold sm:text-6xl text-3xl  ">{index + 1}</span>
            </div>
            <span className="font-bold text-[#5f6163] text-2xl text-center mb-4">
              {step.heading}
            </span>
            <span className="w-full max-w-[450px]  text-base leading-loose  text-center">
              {step.content}
            </span>
          </div>
        ))}
      </div>
      <Button
        onClick={() => scrollToComponent("stream_services")}
        className=" ml-5 mt-10 flex justify-center rounded-lg items-center
    w-fit-content border-[#49DE80]  bg-transparent border border-solid  font-bold text-white-200 px-7 py-5 "
      >
        <span className="">Explore Services</span>
      </Button>
    </div>
  );
};

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

  const scrollToComponent = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

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
            with others, you can save money on streaming.
          </span>
          <div className=" sm:w-fit-content  w-full flex justify-start items-center ">
            <Button
              onClick={() => scrollToComponent("stream_services")}
              className="  flex justify-center rounded-lg items-center
    w-fit-content bg-[#49DE80]  font-bold border-none text-black-500 px-7 py-5 "
            >
              <span>Explore Services</span>
            </Button>
            <Button
              onClick={() => scrollToComponent("how_it_works")}
              className=" ml-5  flex justify-center rounded-lg items-center
    w-fit-content border-[#49DE80]  bg-transparent border border-solid  font-bold text-white-200 px-7 py-5 "
            >
              <span className="">See how it works</span>


            </Button>
          </div>
        </div>
        <div className="sm:mt-0 mt-20 flex ">
          <Image
            width={800}
            height={800}
            src="/static/images/streamcel_hero_main_3.png"
          />
        </div>
      </div>

      {/* <Banner {...bannerButtonContent} /> */}
      <section
        id="card_content_wrapper"
        className=" w-full px-[5%] flex flex-col     "
      >
        <section id="stream_services" className="flex ">
          <StreamServices />
        </section>
        <section id="how_it_works" className="w-full my-20">
          <HowItWorks />
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
