import { useState, useEffect, useMemo } from "react";
import useCheckMobileScreen from "@hooks/useIsMobile";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import StreamServiceActionPage from "@components/StreamServiceAction";
import Layout from "../components/Layout";
import StreamServices from "../components/streamServices";
import { useStreamService } from "../providers/streamServiceProvider";
import { Button, Modal } from "antd";
import { StreamPlan, InvitationDetailsType } from "../interfaces/index";
import FaqSection from "../components/faq";

const { confirm } = Modal;

type Steps = { heading: string; content: string };
const HowItWorks = () => {
  const steps: Array<Steps> = [
    {
      heading: "Select a Stream Service",
      content:
        "We provide a variety of streaming options that would interest, whether you want to view a movie or listen to your favorite singer.",
    },
    {
      heading: "Request or Share a Membership",
      content:
        "Owners of streaming service memberships can list their membership on Streamcel for sharing with other users. If you want to join a membership, you can do so by submitting a membership group request. Once you've been admitted to a  group, you'll either be emailed an invitation or allowed access to the stream service membership through credentials.",
    },
    {
      heading: "Enjoy More Streaming!",
      content:
        "Each group member will be charged an equal share of the membership cost, with the owner receiving the entire sum at the end of the month. Now you can get more services at a lower cost.",
    },
  ];
  const scrollToComponent = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full mt-20 justify-center items-center flex flex-col">
      <span className=" font-bold mb-4 text-3xl ">How Does It Work?</span>
      <div className="w-full  flex sm:flex-row flex-col justify-between items-start">
        {steps.map((step, index) => (
          <div
            key={`key_steps_${index}`}
            className="flex mt-10 sm:px-10  justify-end items-center flex-col"
          >
            <div className="rounded-full sm:h-32 h-20 sm:w-32 w-20 mb-10 border-2 border-[#5f6163]  border-solid flex justify-center items-center">
              <span className=" font-bold sm:text-6xl text-3xl  ">
                {index + 1}
              </span>
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
        className=" mt-10 flex justify-center rounded-lg items-center
    w-fit-content border-[#49DE80]  bg-transparent border border-solid  font-bold text-white-200 px-7 py-5 "
      >
        <span className="">Explore Services</span>
      </Button>
    </div>
  );
};

const IndexPage = () => {
  const router = useRouter();
  const { streamServices, streamService, setStreamService } =
    useStreamService();
  const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
  const isMobile = useCheckMobileScreen();

  const [isMakingOffer, setMakeOffer] = useState<boolean>(false);
  const { ref } = router.query;
  const [invitationDetails, setInvitationDetails] =
    useState<InvitationDetailsType | null>(null);

  useEffect(() => {
    try {
      if (ref) {
        const inviteRef: InvitationDetailsType = JSON.parse(
          atob(ref as string)
        );
        if (inviteRef.pool) {
          setInvitationDetails(inviteRef);
          const streamService = streamServices.find(
            (service) => service.id === inviteRef.id
          );
          if (streamService) {
            setStreamService(streamService);
          }
        }
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (streamService) {
      if (streamService.streamPlans?.length === 1) {
        setSelectedPlan(streamService.streamPlans[0]);
      }
    }
  }, [streamService]);

  const onCloseModal = () => {
    setStreamService(null);
    setSelectedPlan(null);
    setMakeOffer(null);
  };

  const scrollToComponent = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout title="Stream more for less">
      <Head>
        <meta property="og:title" content="Streamcel" />
        <meta property="og:url" content="https://www.streamcel.com" />
        <meta
          property="og:description"
          content="Stream more at a budget by sharing subscriptions to your favourite streaming services with other people"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1669138720/metas/Artboard_1_copy_swvwml_11zon_2_kaxkxc.jpg"
        />
        <meta property="twitter:title" content="Streamcel " />
        <meta
          property="twitter:description"
          content="Stream more at a budget by sharing subscriptions to your favourite streaming services with other people"
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1669138720/metas/Artboard_1_copy_swvwml_11zon_2_kaxkxc.jpg"
        />
        <meta property="twitter:card" content="summary"></meta>
      </Head>
      <div className=" flex sm:flex-row flex-col px-[5%] mt-10 w-full justify-between items-center ">
        <div className="flex flex-col sm:bg-transparent  rounded-xl  text-white-200 ">
          <span className=" text-[46px] leading-tight md:text-[46px] lg:text-[66px] xl:text-[76px] 2xl:text-[86px] sm:w-2/3 w-full font-bold sm:mb-2 mb-2 ">
            Stream More, for Less
          </span>
          <span className="my-6 text-[#95999c] text-base w-full lg:w-3/4 xl:w-3/4 2xl:w-3/4 leading-loose text-justify sm:font-medium font-normal ">
            Watch all of your favorite shows without having to worry about
            spending a lot of money. Share subscriptions and save money now.
          </span>
          <div className=" sm:w-fit-content  w-full flex justify-start items-center ">
            <Button
              onClick={() => router.push("/signup")}
              className="  flex justify-center rounded-lg items-center
    w-fit-content bg-[#49DE80]  font-bold border-none text-black-500 px-7 py-5 "
            >
              <span>Get Started</span>
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
            width={560}
            height={560}
            src="https://res.cloudinary.com/drda29q8x/image/upload/v1667927912/stream%20service%20logos/Group_28_1_edbjui.png"
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
        <section id="how_it_works" className="w-full mt-20">
          <HowItWorks />
        </section>
        <section className="  ">
          <FaqSection />
        </section>
        <section className="flex w-full sm:p-10 p-5 flex-wrap  sm:mt-0 mt-20   mb-20 justify-between  items-center bg-[#8F3985] rounded-2xl">
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
            <a className="text-black-400" href="mailto:hello@streamcel.com">
              <span className=" text-black-400">Get In Touch</span>
            </a>
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
            <StreamServiceActionPage
              invitationDetails={invitationDetails}
              onHeaderClick={() => onCloseModal()}
            />
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default IndexPage;
