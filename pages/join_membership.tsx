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
        <meta
          property="og:url"
          content="https://www.streamcel.com/join_membership"
        />
        <meta
          property="og:description"
          content={`Join ${parseinviteRefData()?.owner || "member"}'s ${
            parseinviteRefData()?.serviceName || "stream service"
          } membership pool`}
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1668419884/Artboard_1_copy_swvwml.png"
        />
        <meta property="og:title" content="Streamcel | Join a membership" />
        <meta property="og:title" content="Streamcel " />
        <meta
          property="og:description"
          content={`Join ${parseinviteRefData()?.owner || "users"}'s ${
            parseinviteRefData()?.serviceName
          } membership pool`}
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/drda29q8x/image/upload/v1668419884/Artboard_1_copy_swvwml.png"
        />
        <meta property="twitter:card" content="summary"></meta>
      </Head>
    </div>
  );
};

IndexPage.getInitialProps = async ({ query }) => {
  const { ref } = query;
  return { inviteRef: ref };
};

export default IndexPage;
