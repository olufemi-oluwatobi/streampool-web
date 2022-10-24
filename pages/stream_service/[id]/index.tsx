import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PaymentOption from "@components/PaymentOption";
import { useFormik, FormikProvider } from "formik";
import Image from "next/image";
import ServiceDetails from "@components/ServiceDetails";
import Layout from "@components/Layout";
import { useStreamService } from "@providers/streamServiceProvider";
import StreamServiceActionPage from "@components/StreamServiceAction";
import { Button, Modal, Input } from "antd";
import { PoolRequestType, PoolType, StreamPlan } from "@interfaces/index";
import { useAuthContext } from "@providers/authProvider";
import { useNotification } from "@providers/notificationProvider";
import classNames from "classnames";

const { confirm } = Modal;

const IndexPage = () => {
    const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
    const [isMakingOffer, setMakeOffer] = useState<boolean>(false);


    const maxMemberCount = useMemo(() => {
        return parseInt(selectedPlan?.max_limit) - 1;
    }, [selectedPlan]);


    const { query } = useRouter();
    const {
        streamService,
        setStreamService,
        streamServices
    } = useStreamService();

    const { id } = query

    useEffect(() => {
        if (streamServices && id) {
            const service = streamServices.find(service => service.id === parseInt(id as string, 10))
            if (service) {
                setStreamService(service)
            }
        }
    }, [streamServices])

    useEffect(() => {
        return () => {
            setStreamService(null)
        }
    }, [])
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
        setMakeOffer(null)
    };



    return (
        <Layout title="Stream more for less">
            <div className="h-full flex justify-between flex-col">
                {streamService && <Image src={streamService?.icon || ""} width="700" height="300" objectFit='cover' />}

                <div className=" flex sm:flex-row p-5 flex-col mt-4 h-full w-full justify-between items-center ">
                    <StreamServiceActionPage onHeaderClick={() => onCloseModal()} />
                </div>

            </div>
        </Layout>
    );
};

export default IndexPage;
