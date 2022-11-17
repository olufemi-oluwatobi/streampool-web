import { useEffect } from "react";
import { useRouter } from "next/router";
import { Head } from "next/document";
import { InvitationDetailsType } from "../interfaces/index";

import useIsMobile from "@hooks/useIsMobile";
const IndexPage = () => {
  const { query, push } = useRouter();
  const { ref } = query;
  const isMobile = useIsMobile();
  useEffect(() => {
    console.log(ref);
    if (ref) {
      console.log("in here");
      if (isMobile) {
        push(`/stream_service?ref=${ref}`);
      }
      push(`/?ref=${ref}`);
    }
  }, [ref]);

  const parseRefData = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.ref) {
      const inviteRef: InvitationDetailsType = JSON.parse(atob(ref as string));
      return inviteRef;
    }
  };
  return (
    <div className=" bg-black-700 p-[5%]  h-screen flex justify-center ">
      <Head>
        <meta property="og:title" content="Streamcel" />
        <meta property="og:url" content="https://www.streamcel.com" />
        <meta
          name="og:description"
          content={`Join ${parseRefData()?.owner || "member"}'s ${
            parseRefData()?.serviceName || "stream service"
          } membership pool`}
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1668419884/Artboard_1_copy_swvwml.png"
        />
        <meta name="twitter:title" content="Streamcel " />
        <meta
          name="og:description"
          content={`Join ${parseRefData()?.owner || "users"}'s ${
            parseRefData()?.serviceName
          } membership pool`}
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1668419884/Artboard_1_copy_swvwml.png"
        />
        <meta name="twitter:card" content="summary"></meta>
      </Head>
    </div>
  );
};

export default IndexPage;
