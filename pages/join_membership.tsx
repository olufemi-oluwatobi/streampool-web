import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { InvitationDetailsType } from "../interfaces/index";

import useIsMobile from "@hooks/useIsMobile";
const IndexPage = ({ inviteRef }) => {
  const { push } = useRouter();
  const isMobile = useIsMobile();
  useEffect(() => {
    if (inviteRef) {
      if (isMobile) {
        push(`/stream_service?ref=${inviteRef}`);
      }
      push(`/?ref=${inviteRef}`);
    }
  }, [inviteRef]);

  const parseinviteRefData = () => {
    if (inviteRef) {
      const invitationData: InvitationDetailsType = JSON.parse(
        atob(inviteRef as string)
      );
      return invitationData;
    }
  };
  return (
    <div className=" bg-black-700 p-[5%]  h-screen flex justify-center ">
      <Head>
        <meta property="og:title" content="Streamcel" />
        <meta property="og:url" content="https://www.streamcel.com" />
        <meta
          name="og:description"
          content={`Join ${parseinviteRefData()?.owner || "member"}'s ${
            parseinviteRefData()?.serviceName || "stream service"
          } membership pool`}
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1668419884/Artboard_1_copy_swvwml.png"
        />
        <meta name="twitter:title" content="Streamcel " />
        <meta
          name="og:description"
          content={`Join ${parseinviteRefData()?.owner || "users"}'s ${
            parseinviteRefData()?.serviceName
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

IndexPage.getInitialProps = async ({ query }) => {
  const { ref } = query;
  console.log("query ===", query);
  return { inviteRef: ref };
};

export default IndexPage;
