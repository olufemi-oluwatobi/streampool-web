import React from "react";
import Image from "next/image";
import classNames from "classnames";
import { Collapse } from "antd";
const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const questionAndAnswers = [
    {
        question: "How can i join memberships?",
        answer:
            "To join a membership, consumers must first request a membership for their preferred stream service. When your request is confirmed, you will either be given the credentials to the membership account or the stream service will send you an invitation.",
    },
    {
        question: "How do I pay subscriptions fees?",
        answer:
            "You will be charged a monthly subscription fee for each service you subscribe to. Subscription fees are split equally among all members of the pool/membership",
    },
    {
        question: "How can I offer a membership?",
        answer:
            "You can share a membership by clicking on the streaming service you want to offer. Click on share a membership button. Your membership would be open for requests, membership requests will be sent to you",
    },
    {
        question: "How do I receive payment for memberships I created?",
        answer:
            "Customers who create memberships have a wallet. Subscription fees paid by members of your membership are credited to the wallet. Owners of memberships can withdraw funds from their wallet 30 days after members are charged subscription fees.",
    },
];
const FaqSection = () => {
    return (
        <div className="w-full flex mt-20  text-white-200  flex-col">
            <div className="w-full flex flex-col md:flex-row lg:flex-row justify-between items-center ">
                <div className=" w-full flex flex-col md:w-full lg:w-7/12 ">
                    <span className=" text-3xl mb-10 ">Frequently Asked Questions</span>
                    <Collapse
                        expandIconPosition="right"
                        accordion
                        expandIcon={({ isActive }) => (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={classNames("w-6 h-6", { "rotate-45": isActive })}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                        )}
                    >
                        {questionAndAnswers.map((d, index) => (
                            <Panel
                                key={index}
                                className=" text-xl"
                                header={d.question}
                            >
                                <p>{d.answer}</p>
                            </Panel>
                        ))}

                        {/* <Panel header="This is panel header 2" key="2">
                            <p>{text}</p>
                        </Panel>
                        <Panel header="This is panel header 3" key="3">
                            <p>{text}</p>
                        </Panel> */}
                    </Collapse>
                </div>
                <div className="w-full hidden md:flex lg:flex  justify-end md:w-full lg:w-5/12 ">
                    <Image width="600" height="600" src="/static/images/faq_2.svg" />
                </div>
            </div>
        </div>
    );
};

export default FaqSection;
