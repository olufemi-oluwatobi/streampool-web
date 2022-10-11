import React from "react"
import Image from "next/image"
import classNames from "classnames";
import { Collapse } from 'antd';
const { Panel } = Collapse;


const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const FaqSection = () => {
    return (
        <div className="w-full flex text-white-200  flex-col">
            <div className="w-full flex flex-col md:flex-row lg:flex-row justify-between items-center ">
                <div className=" w-full flex flex-col md:w-full lg:w-7/12 ">
                    <span className=" text-3xl mb-10 ">Frequently Asked Questions</span>
                    <Collapse expandIconPosition="right"
                        accordion
                        expandIcon={({ isActive }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classNames("w-6 h-6", { "rotate-45": isActive })}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        }
                    >
                        {[1, 2, 3, 4, 5].map((d, index) => (
                            <Panel key={index} className=" text-xl" header="This is panel header 1">
                                <p>{text}</p>
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
    )
}

export default FaqSection