/* eslint-disable */
import React, { useMemo, useCallback } from "react";
import className from "classnames";
import { decryptPassword, calculateAmount } from "@utils/helpers";
import { useRouter } from "next/router";
import useCopyToClipboard from "@hooks/useCopy";
import useCheckMobileScreen from "@hooks/useIsMobile";
import { useNotification } from "@providers/notificationProvider";
import {
  useStreamService,
  StreamService,
} from "../../providers/streamServiceProvider";
import { ServiceCard, ServiceCardPlaceholder } from "../ServiceCard";
import { useAuthContext } from "@providers/authProvider";

const ServiceCategory = ({
  services,
  category,
  onClick,
  isLoading,
  verticalOnMobile = false,
}: {
  services: StreamService[];
  onClick: (service: StreamService) => void;
  isLoading: boolean;
  category: string;
  verticalOnMobile?: boolean;
}) => {
  const { triggerNotification } = useNotification();
  const { authData } = useAuthContext();
  const { streamServices } = useStreamService();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const copyPoolPassword = (password: string) => {
    const decryptedPassword = decryptPassword(
      password,
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY
    );
    copyToClipboard(decryptedPassword);
    triggerNotification("Password Copied", "Password Copied!", "success");
  };
  const getButtonText = useCallback(
    (streamService: StreamService) => {
      const isOwner = authData?.user?.offeredSubs?.some(
        (sub) => sub.stream_service_id === streamService?.id
      );
      const isMember = authData?.user?.pools?.find(
        (pool) => pool?.stream_service_id === streamService?.id
      );
      if (isOwner) return "View My Membership";
      if (isMember) return "View Membership";
      return "View Service";
    },
    [authData, streamServices]
  );
  return (
    <div className=" w-full flex flex-col  justify-center items-center ">
      <div className="flex flex-col w-full justify-start items-start mb-6">
        <span
          className={className("  font-bold text-3xl capitalize  mb-4 ", {
            "sm:px-0 px-6": verticalOnMobile,
          })}
        >
          {category}.
        </span>
      </div>
      <div
        className={className({
          " sm:grid flex overflow-x-scroll hide-scroll-bar sm:w-full w-screen ":
            verticalOnMobile,
        })}
      >
        <div
          className={className("w-full", {
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2x:grid-cols-4 gap-8 md:gap-2 lg:gap-6 xl:gap-12":
              !verticalOnMobile,
            " sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2x:grid-cols-4 gap-2 md:gap-2 lg:gap-6 xl:gap-12 flex flex-nowrap sm:px-0 px-6 ":
              verticalOnMobile,
          })}
        >
          {services.length
            ? services?.map((service) => (
                <div
                  key={`gift-card-key-${Math.random()}`}
                  className={className(" w-full", {
                    "sm:min-w-0 min-w-[270px] sm:mr-0 mr-6": verticalOnMobile,
                    "min-w-[300px]": !verticalOnMobile,
                  })}
                >
                  <ServiceCard
                    buttonProp={{
                      label: getButtonText(service),
                      onClick: () => {
                        onClick(service);
                      },
                    }}
                    hasNotification={authData?.user?.membershipRequests?.some(
                      (request) => request.stream_service_id === service.id
                    )}
                    maxMemberCount={service.streamPlans[0]?.max_limit}
                    currency={service.streamPlans[0]?.currency}
                    image={service.icon}
                    name={service.name}
                    commissionCost={200}
                    type="Audio Streaming Service"
                    amount={calculateAmount(
                      service.streamPlans[0]?.amount,
                      service.streamPlans[0]?.max_limit
                    )}
                    oldAmount={service.streamPlans[0]?.amount}
                    key={`gift-card-key-${Math.random()}`}
                  />
                </div>
              ))
            : new Array(4).fill("").map((_) => (
                <div
                  key={`gift-card-key-${Math.random()}`}
                  className={className(" w-full", {
                    "sm:min-w-0 min-w-[270px] sm:mr-0 mr-6": verticalOnMobile,
                    "min-w-[300px]": !verticalOnMobile,
                  })}
                >
                  <ServiceCardPlaceholder />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const { streamServices, setStreamService, isLoading } = useStreamService();
  const isMobile = useCheckMobileScreen();
  const router = useRouter();
  const categories = useMemo(() => {
    let data: string[] = [];
    if (streamServices.length) {
      streamServices.forEach((service) =>
        service.categories.forEach(
          (cat) => !data.includes(cat.name) && data.push(cat.name)
        )
      );
    } else {
      data = ["popular", "music streaming services", "video streaming servies"];
    }
    const popularIndex = data.findIndex((d) => d.toLowerCase() === "popular");
    if (popularIndex !== 0 && popularIndex > -1) {
      const dataZero = data[0];
      data[popularIndex] = dataZero;
      data[0] = "popular";
    }
    return data;
  }, [streamServices]);

  const renderData = useCallback(() => {
    return categories.map((category) => (
      <div
        key={`service-category-${Math.random()}`}
        className="flex mt-20 flex-col"
      >
        <ServiceCategory
          services={streamServices.filter(
            (service) =>
              service.categories.filter((cat) => cat.name === category).length
          )}
          key={`service-category-${Math.random()}`}
          isLoading={isLoading}
          verticalOnMobile={category.toLowerCase() === "popular"}
          category={category}
          onClick={(service) => {
            setStreamService(service);
            if (isMobile) router.push(`/stream_service/${service.id}`);
          }}
        />
      </div>
    ));
  }, [streamServices]);

  return (
    <div
      id="gift_card_wrapper"
      className=" flex items-center    justify-center  w-full h-fit-content"
    >
      <div className=" w-full flex flex-col justify-center items-center ">
        {renderData()}
      </div>
    </div>
  );
};

export default Index;
