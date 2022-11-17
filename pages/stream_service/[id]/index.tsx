import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "@components/Layout";
import { useStreamService } from "@providers/streamServiceProvider";
import StreamServiceActionPage from "@components/StreamServiceAction";
import { Modal } from "antd";
import { InvitationDetailsType, StreamPlan } from "@interfaces/index";

const { confirm } = Modal;

const IndexPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
  const [isMakingOffer, setMakeOffer] = useState<boolean>(false);
  const [invitationDetails, setInvitationDetails] =
    useState<InvitationDetailsType | null>(null);

  const maxMemberCount = useMemo(() => {
    return parseInt(selectedPlan?.max_limit) - 1;
  }, [selectedPlan]);

  const { query } = useRouter();
  const { streamService, setStreamService, streamServices } =
    useStreamService();

  const { id, ref } = query;

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
    if (streamServices && id) {
      const service = streamServices.find(
        (service) => service.id === parseInt(id as string, 10)
      );
      if (service) {
        setStreamService(service);
      }
    }
  }, [streamServices]);

  useEffect(() => {
    return () => {
      setStreamService(null);
    };
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

  return (
    <Layout title="Stream more for less">
      <div className="h-full flex justify-between flex-col">
        {streamService && (
          <Image
            src={streamService?.icon || ""}
            width="700"
            height="300"
            objectFit="cover"
          />
        )}

        <div className=" flex sm:flex-row p-5 flex-col mt-4 h-full w-full justify-between items-center ">
          <StreamServiceActionPage
            invitationDetails={invitationDetails}
            onHeaderClick={() => onCloseModal()}
          />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
