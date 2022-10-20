import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useFormik, FormikProvider } from "formik";
import Image from "next/image";
import Link from "next/link";
import ServiceDetails from "../components/ServiceDetails";
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

const IndexPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<StreamPlan | null>(null);
  const [modalContentState, setModalContentState] = useState<
    | "init"
    | "requesting_email"
    | "requesting_payment_details"
    | "success"
    | "error"
  >("init");
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);

  const [isMakingOffer, setMakeOffer] = useState<boolean>(false);
  const [customEmail, setCustomEmail] = useState<string | null>(null);
  const fields = useFormik({
    initialValues: {
      email: "",
      password: "",
      maxMemberCount: parseInt(selectedPlan?.max_limit) - 1,
    },
    onSubmit: async (values) => {

    },
  });
  const {
    authData,
    verifyUser,
    addPaymentDetails,
    fetchUserData,
    isAuthLoading,
  } = useAuthContext();
  const { triggerNotification } = useNotification();
  const { query } = useRouter();
  const {
    isLoading,
    streamService,
    requestMembership,
    createPool,
    setStreamService,
    cancelRequest,
  } = useStreamService();

  const submitRequest = async () => {
    try {
      await requestMembership({
        streamServiceId: streamService.id,
        customEmail,
      });
      triggerNotification("Request Succesful", "Request Succesful", "success");
      await fetchUserData();
      setModalContentState("init");
    } catch (error) {
      setModalContentState("error");
    }
  };

  const submitOffer = async () => {
    console.log(fields);
    try {
      await createPool({
        streamServiceId: streamService.id,
        email: fields.values.email,
        planId: selectedPlan.id,
        maxMemberCount: fields.values.maxMemberCount,
        password: fields.values.password,
        name: `${authData?.user?.username}-${streamService?.name}`,
      });
      triggerNotification("Request Succesful", "Request Succesful", "success");
      await fetchUserData();
      setModalContentState("init");
    } catch (error) {
      //setModalContentState("error");
    }
  };

  const onRequestCancel = async () => {
    try {
      await cancelRequest(serviceRequest.id);
      triggerNotification("Request Cancelled", "Request Cancelled", "success");
      await fetchUserData();
      setModalContentState("init");
    } catch (error) {
      setModalContentState("error");
    }
  };

  useEffect(() => {
    if (streamService) {
      if (streamService.streamPlans?.length === 1) {
        setSelectedPlan(streamService.streamPlans[0]);
      }
    }
  }, [streamService]);

  const serviceEmail = useMemo(() => {
    if (!authData) return null;
    const email = authData?.user?.emails?.find(
      (email) => email.stream_service_id === streamService?.id
    );
    if (!email) return authData?.user?.email;
    return email?.email;
  }, [streamService]);

  useEffect(() => {
    const { token } = query;
    console.log(token, query);
    if (token) {
      verifyUser(token as string, {
        onSuccess: () => {
          console.log("successful");
          triggerNotification(
            "Verification Success",
            "Your account has been verified",
            "success"
          );
        },
        onError: () => {
          console.log("error");
          triggerNotification("Verification Error", "Invalid Token", "error");
        },
      });
    }
  }, [query]);

  const serviceRequest = useMemo<PoolRequestType | null>(() => {
    if (!authData) return null;
    const request = authData?.user?.poolRequests?.find(
      (poolRequest) =>
        poolRequest?.stream_service_id === streamService?.id &&
        poolRequest.status === "pending"
    );
    return request;
  }, [authData, streamService]);

  const isPoolOwner = useMemo(() => {
    return authData?.user?.offeredSubs?.some(
      (sub) => sub.stream_service_id === streamService?.id
    );
  }, [authData, streamService]);

  const serviceMembership = useMemo<PoolType | null>(() => {
    if (!authData) return null;
    return authData?.user?.pools?.find(
      (pool) => pool?.stream_service_id === streamService?.id
    );
  }, [authData, streamService]);

  const membershipStatus = useMemo(() => {
    console.log("Status botccccc", serviceRequest, serviceMembership);
    if (serviceMembership) return "active membership";
    if (serviceRequest) return "pending request";
    return null;
  }, [authData, serviceRequest, serviceMembership]);

  const getCurrentStreamPlan = () => {
    const status = membershipStatus;
    if (!status) return selectedPlan;
    if (status === "pending request") {
      const plan = streamService.streamPlans[0];
      return plan;
    }
    if (status === "active membership") {
      const pool = authData?.user?.pools?.find(
        (pool) => pool?.stream_service_id === streamService?.id
      );
      const plan = streamService.streamPlans.find(
        (plan) => plan.id === pool.stream_plan_id
      );
      return plan;
    }
  };

  const currentPool = useMemo(() => {
    if (!authData) return null;
    if (isPoolOwner) {
      return authData?.user?.offeredSubs.find(
        (pool) => pool?.stream_service_id === streamService?.id
      );
    }
    const pool = authData?.user?.pools?.find(
      (pool) => pool?.stream_service_id === streamService?.id
    );
    return pool;
  }, [authData, streamService]);

  const onCloseModal = () => {
    setStreamService(null);
    setSelectedPlan(null);
    setSubmittingRequest(false);
  };

  const requestEmail = () => {
    return (
      <div className="w-full py-4 px-2 modal-input flex flex-col">
        <div className="w-full flex mb-6 items-center justify-between text-white-200   ">
          <div className="flex items-center mr-8  ">
            <button
              onClick={() => setModalContentState("init")}
              className=" outline-none bg-none mr-4  w-6 h-6 justify-center items-center bg-[#444444] flex rounded-full "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <span className=" text-base   ">
              Add your {streamService.name} membership email
            </span>
          </div>
        </div>
        <Input
          onChange={(e) => setCustomEmail(e.target.value)}
          className="h-10"
          placeholder="(optional) Enter the email you wish to use for this service"
        />
        <Button
          loading={isLoading}
          onClick={() => {
            if (authData.paymentDetails) {
              submitRequest();
            } else {
              setModalContentState("requesting_payment_details");
            }
          }}
          className={
            "w-full  h-10 mt-6 font-bold border-none  text-md rounded-md text-black-300 bg-[#9DDBAD]  "
          }
        >
          Submit Request
        </Button>
      </div>
    );
  };

  const renderPaymentDetailsOptions = () => {
    return (
      <div className="w-full py-4 px-2 modal-input flex flex-col">
        <div className="w-full flex mb-6 items-center justify-between text-white-200   ">
          <div className="flex items-center mr-8  ">
            <span className=" text-base   ">Add Payment Method</span>
          </div>
          <button
            onClick={() => onCloseModal()}
            className=" outline-none bg-none  w-6 h-6 justify-center items-center bg-[#444444] flex rounded-full "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="w-full text-white-400 mt-4  flex flex-col justify- items-center   ">
          <svg
            width="100"
            height="100"
            viewBox="0 0 512 331"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M503.792 295.968C503.792 310.554 491.858 322.488 477.272 322.488H34.727C20.141 322.488 8.20703 310.554 8.20703 295.968V34.728C8.20703 20.142 20.141 8.20801 34.727 8.20801H477.272C491.858 8.20801 503.792 20.142 503.792 34.728V295.968Z"
              fill="#61B8CC"
            />
            <path
              d="M503.79 54.844H8.20801V86.227H503.79V54.844Z"
              fill="#333E48"
            />
            <path
              d="M462.189 177.282C462.189 183.117 457.416 187.891 451.581 187.891H394.564C388.731 187.891 383.956 183.117 383.956 177.282V142.806C383.956 136.972 388.731 132.199 394.564 132.199H451.581C457.416 132.199 462.189 136.972 462.189 142.806V177.282Z"
              fill="#FED771"
            />
            <path
              d="M423.07 180.422C439.165 180.422 452.213 171.299 452.213 160.045C452.213 148.791 439.165 139.668 423.07 139.668C406.975 139.668 393.927 148.791 393.927 160.045C393.927 171.299 406.975 180.422 423.07 180.422Z"
              fill="#E5AB46"
            />
            <path
              d="M229.482 131.756H47.8184V188.343H229.482V131.756Z"
              fill="#99DAEA"
            />
            <path
              d="M180.55 233.913C173.494 233.913 168.666 238.693 168.666 244.932V245.023C168.666 251.169 173.174 255.131 179.958 255.131C183.374 255.131 185.831 253.673 187.426 251.763C187.243 257.634 184.421 261.779 179.73 261.779C177.543 261.779 175.769 261.142 173.901 259.821C173.446 259.547 172.945 259.366 172.352 259.366C170.894 259.366 169.711 260.459 169.711 261.916C169.711 262.962 170.211 263.737 170.985 264.237C173.353 265.831 175.993 266.879 179.59 266.879C188.195 266.879 193.25 259.777 193.25 249.531V249.439C193.25 243.155 191.747 239.65 189.425 237.283C187.154 235.051 184.559 233.913 180.55 233.913ZM187.244 244.704C187.244 247.8 184.831 250.44 180.779 250.44C176.817 250.44 174.268 248.074 174.268 244.75V244.659C174.268 241.38 176.635 238.74 180.597 238.74C184.649 238.74 187.244 241.29 187.244 244.612V244.704ZM58.699 234.049H58.608C57.788 234.049 56.968 234.232 55.875 234.55L51.049 236.097C49.91 236.415 49.182 237.326 49.182 238.51C49.182 239.785 50.321 240.878 51.641 240.878C51.915 240.878 52.324 240.831 52.642 240.741L55.922 239.739V263.78C55.922 265.33 57.197 266.557 58.699 266.557C60.248 266.557 61.476 265.329 61.476 263.78V236.825C61.477 235.278 60.293 234.049 58.699 234.049ZM144.396 249.804C147.083 248.392 149.04 246.253 149.04 242.702V242.61C149.04 237.693 144.351 234.006 137.976 234.006C131.601 234.006 126.912 237.74 126.912 242.61V242.702C126.912 246.253 128.871 248.393 131.556 249.804C127.959 251.307 125.818 253.719 125.818 257.544V257.634C125.818 263.144 131.01 266.787 137.975 266.787C144.942 266.787 150.132 263.235 150.132 257.544V257.452C150.133 253.674 147.902 251.397 144.396 249.804ZM132.284 243.111C132.284 240.697 134.561 238.693 137.976 238.693C141.392 238.693 143.668 240.697 143.668 243.155V243.246C143.668 245.979 141.255 247.936 137.976 247.936C134.697 247.936 132.284 245.978 132.284 243.202V243.111ZM144.669 257.316C144.669 259.958 142.165 262.097 137.976 262.097C133.787 262.097 131.328 259.912 131.328 257.316V257.225C131.328 254.311 134.196 252.4 137.976 252.4C141.756 252.4 144.669 254.311 144.669 257.225V257.316ZM477.273 0H34.727C15.578 0 0 15.578 0 34.728V295.968C0 315.117 15.578 330.695 34.727 330.695H477.272C496.42 330.695 511.999 315.117 511.999 295.968V34.728C512 15.578 496.421 0 477.273 0ZM495.585 295.968C495.585 306.066 487.371 314.28 477.273 314.28H34.727C24.63 314.28 16.415 306.065 16.415 295.968V94.439H495.584L495.585 295.968ZM495.585 78.024H16.415V63.056H495.584L495.585 78.024ZM495.585 46.641H16.415V34.728C16.415 24.63 24.629 16.416 34.727 16.416H477.272C487.37 16.416 495.584 24.631 495.584 34.728L495.585 46.641ZM108.332 233.913C101.276 233.913 96.448 238.693 96.448 244.932V245.023C96.448 251.169 100.956 255.131 107.74 255.131C111.156 255.131 113.613 253.673 115.208 251.763C115.025 257.634 112.203 261.779 107.512 261.779C105.327 261.779 103.551 261.142 101.683 259.821C101.228 259.547 100.727 259.366 100.134 259.366C98.676 259.366 97.493 260.459 97.493 261.916C97.493 262.962 97.994 263.737 98.767 264.237C101.135 265.831 103.775 266.879 107.372 266.879C115.977 266.879 121.032 259.777 121.032 249.531V249.439C121.032 243.155 119.531 239.65 117.207 237.283C114.934 235.051 112.34 233.913 108.332 233.913ZM115.025 244.704C115.025 247.8 112.612 250.44 108.56 250.44C104.598 250.44 102.049 248.074 102.049 244.75V244.659C102.049 241.38 104.416 238.74 108.378 238.74C112.43 238.74 115.025 241.29 115.025 244.612V244.704ZM88.889 261.414H75.958L82.514 255.95C88.16 251.353 90.802 248.62 90.802 243.611V243.521C90.802 237.829 86.522 234.006 80.284 234.006C75.275 234.006 72.316 235.919 69.721 239.15C69.311 239.651 69.084 240.288 69.084 240.881C69.084 242.292 70.221 243.43 71.634 243.43C72.545 243.43 73.183 243.021 73.592 242.564C75.55 240.198 77.326 239.014 79.876 239.014C82.79 239.014 85.021 240.834 85.021 243.977C85.021 246.844 83.427 248.893 79.057 252.581L69.268 260.913C68.312 261.687 67.81 262.598 67.81 263.692C67.81 265.331 69.086 266.332 70.815 266.332H88.89C90.256 266.332 91.348 265.24 91.348 263.874C91.346 262.507 90.254 261.414 88.889 261.414ZM356.637 263.418C359.232 265.421 362.51 266.878 366.836 266.878C373.665 266.878 378.491 262.552 378.491 256.088V255.996C378.491 249.257 373.619 245.979 367.382 245.979C365.241 245.979 363.831 246.342 362.327 246.891L362.828 239.423H374.803C376.169 239.423 377.307 238.331 377.307 236.965C377.307 235.6 376.169 234.461 374.803 234.461H360.369C359.002 234.461 357.909 235.508 357.818 236.965L357.135 248.438C357.089 249.486 357.407 250.305 358.227 250.896C359.319 251.671 360.003 251.989 360.869 251.989C361.734 251.989 363.236 250.896 366.332 250.896C370.203 250.896 372.934 252.901 372.934 256.176V256.268C372.934 259.639 370.339 261.778 366.742 261.778C364.238 261.778 362.007 260.867 359.821 259.09C359.366 258.728 358.865 258.545 358.182 258.545C356.725 258.545 355.495 259.775 355.495 261.231C355.498 262.143 355.954 262.871 356.637 263.418ZM257.644 266.331H275.72C277.086 266.331 278.179 265.239 278.179 263.873C278.179 262.507 277.086 261.414 275.72 261.414H262.789L269.345 255.95C274.991 251.353 277.633 248.62 277.633 243.611V243.521C277.633 237.829 273.353 234.006 267.115 234.006C262.106 234.006 259.147 235.919 256.552 239.149C256.142 239.65 255.915 240.287 255.915 240.88C255.915 242.291 257.052 243.429 258.465 243.429C259.376 243.429 260.012 243.02 260.423 242.563C262.382 240.197 264.157 239.013 266.707 239.013C269.621 239.013 271.852 240.833 271.852 243.976C271.852 246.843 270.259 248.892 265.888 252.58L256.099 260.912C255.143 261.686 254.642 262.597 254.642 263.691C254.639 265.331 255.914 266.331 257.644 266.331ZM394.564 196.098H451.581C461.956 196.098 470.396 187.657 470.396 177.282V142.806C470.396 132.431 461.955 123.992 451.581 123.992H394.564C384.189 123.992 375.749 132.433 375.749 142.806V177.282C375.749 187.657 384.189 196.098 394.564 196.098ZM392.164 142.806C392.164 141.505 393.263 140.407 394.564 140.407H451.581C452.882 140.407 453.981 141.506 453.981 142.806V177.282C453.981 178.583 452.882 179.683 451.581 179.683H394.564C393.263 179.683 392.164 178.583 392.164 177.282V142.806ZM338.467 266.787C345.434 266.787 350.624 263.235 350.624 257.544V257.452C350.624 253.673 348.394 251.397 344.887 249.803C347.574 248.391 349.531 246.252 349.531 242.701V242.609C349.531 237.692 344.841 234.005 338.467 234.005C332.092 234.005 327.403 237.739 327.403 242.609V242.701C327.403 246.252 329.361 248.392 332.046 249.803C328.449 251.306 326.309 253.718 326.309 257.543V257.633C326.31 263.144 331.501 266.787 338.467 266.787ZM332.775 243.111C332.775 240.697 335.052 238.693 338.467 238.693C341.882 238.693 344.159 240.697 344.159 243.155V243.246C344.159 245.979 341.746 247.936 338.467 247.936C335.188 247.936 332.775 245.978 332.775 243.202V243.111ZM331.819 257.225C331.819 254.311 334.688 252.4 338.467 252.4C342.246 252.4 345.16 254.311 345.16 257.225V257.316C345.16 259.958 342.656 262.097 338.467 262.097C334.278 262.097 331.819 259.912 331.819 257.316V257.225ZM308.232 255.131C311.647 255.131 314.105 253.673 315.699 251.763C315.516 257.634 312.694 261.779 308.005 261.779C305.818 261.779 304.045 261.142 302.176 259.821C301.721 259.547 301.22 259.366 300.627 259.366C299.17 259.366 297.986 260.459 297.986 261.916C297.986 262.962 298.486 263.737 299.261 264.237C301.629 265.831 304.269 266.879 307.866 266.879C316.472 266.879 321.526 259.777 321.526 249.531V249.439C321.526 243.155 320.023 239.65 317.701 237.283C315.425 235.052 312.829 233.913 308.822 233.913C301.766 233.913 296.938 238.693 296.938 244.932V245.023C296.939 251.17 301.448 255.131 308.232 255.131ZM302.541 244.658C302.541 241.379 304.908 238.739 308.87 238.739C312.922 238.739 315.517 241.289 315.517 244.611V244.703C315.517 247.799 313.103 250.439 309.052 250.439C305.09 250.439 302.541 248.073 302.541 244.749V244.658ZM407.771 254.584H405.312V236.69C405.312 235.187 404.083 234.004 402.58 234.004C400.941 234.004 400.166 234.641 399.163 235.825L384.183 253.583C383.363 254.538 382.954 255.449 382.954 256.541C382.954 258.088 384.183 259.182 385.686 259.182H399.937V263.917C399.937 265.42 401.122 266.558 402.625 266.558C404.128 266.558 405.311 265.42 405.311 263.917V259.182H407.77C409.091 259.182 410.092 258.181 410.092 256.906C410.093 255.631 409.092 254.584 407.771 254.584ZM399.939 254.584H389.467L399.939 241.973V254.584ZM228.044 236.918C228.044 238.239 229.137 239.331 230.503 239.331H242.068L234.6 247.299C233.735 248.165 233.416 248.848 233.416 249.574C233.416 250.895 234.508 251.988 235.83 251.988H236.968C241.431 251.988 244.299 253.764 244.299 256.905V256.996C244.299 259.91 241.931 261.823 238.789 261.823C235.83 261.823 233.554 260.776 231.55 258.771C231.095 258.363 230.503 258.044 229.683 258.044C228.226 258.044 226.996 259.273 226.996 260.728C226.996 261.55 227.405 262.322 227.907 262.733C230.503 265.237 234.009 266.876 238.699 266.876C245.346 266.876 249.854 262.641 249.854 256.768V256.677C249.854 250.802 245.3 248.343 240.474 247.752L247.987 239.967C248.943 239.011 249.58 238.237 249.58 236.916C249.58 235.413 248.395 234.458 246.803 234.458H230.502C229.138 234.46 228.044 235.552 228.044 236.918ZM216.614 249.804C219.301 248.392 221.258 246.253 221.258 242.702V242.61C221.258 237.693 216.569 234.006 210.194 234.006C203.819 234.006 199.13 237.74 199.13 242.61V242.702C199.13 246.253 201.089 248.393 203.774 249.804C200.177 251.307 198.036 253.719 198.036 257.544V257.634C198.036 263.144 203.228 266.787 210.193 266.787C217.16 266.787 222.35 263.235 222.35 257.544V257.452C222.352 253.674 220.12 251.397 216.614 249.804ZM204.504 243.111C204.504 240.697 206.78 238.693 210.195 238.693C213.611 238.693 215.887 240.697 215.887 243.155V243.246C215.887 245.979 213.474 247.936 210.195 247.936C206.916 247.936 204.504 245.978 204.504 243.202V243.111ZM216.887 257.316C216.887 259.958 214.383 262.097 210.194 262.097C206.005 262.097 203.547 259.912 203.547 257.316V257.225C203.547 254.311 206.415 252.4 210.194 252.4C213.974 252.4 216.887 254.311 216.887 257.225V257.316ZM47.818 196.547H229.478C234.011 196.547 237.686 192.873 237.686 188.339V131.752C237.686 127.218 234.011 123.544 229.478 123.544H47.818C43.285 123.544 39.61 127.218 39.61 131.752V188.339C39.61 192.872 43.285 196.547 47.818 196.547ZM56.026 139.959H221.27V180.131H56.026V139.959Z"
              fill="#1E252B"
            />
          </svg>

          <span className="mt-2">
            To proceed with your request, you need to add a payment method, you
            only need to do this once
          </span>
          <div className=" bg-[#CDF7F6] font-bold text-black-500 rounded-md mt-6 p-2 ">
            You won't be charged until your request is accepted and your
            membership is active
          </div>
        </div>

        <Button
          loading={isLoading}
          onClick={() => {
            addPaymentDetails(50, {
              onSuccess: () => {
                console.log("in here")
                setModalContentState("init");
                submitRequest();
              },
              onClose: () => console.log("close"),
            });
            if (authData.paymentDetails) {
              submitRequest();
            } else {
              setModalContentState("requesting_payment_details");
            }
          }}
          className={
            "w-full  h-10 mt-6 font-bold border-none  text-md rounded-md text-white-200 bg-[#8F3985] "
          }
        >
          Add Payment Method
        </Button>
      </div>
    );
  };

  const detailButtonLabel = useMemo(() => {
    if (serviceMembership) return "Cancel Membership";
    if (serviceRequest) return "Cancel Request";
    return "Request to Join a Pool";
  }, [authData, serviceRequest, serviceMembership]);

  const showCancelRequestConfirm = () => {
    confirm({
      title: "Are you sure you want to cancel your request",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      ),
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onRequestCancel();
      },
    });
  };

  const buttonProps = useMemo(() => {
    const isRequestButtonProps = {
      onClick: () =>
        membershipStatus === "pending request"
          ? showCancelRequestConfirm()
          : setModalContentState("requesting_email"),
      label: detailButtonLabel,
      className: classNames("bg-white-200 text-black-500", {
        "font-bold": !membershipStatus,
        " font-bold  w-full text-black-500":
          membershipStatus === "pending request",
        "text-[#BA1200] text-black-500 font-bold border-none w-fit-content h-fit-content bg-transparent":
          membershipStatus === "active membership",
      }),
    };

    const makeOwner = {
      onClick: () => {
        !isMakingOffer ? setMakeOffer(true) : submitOffer();
      },
      label: isMakingOffer ? "Submit" : "Make a Subscription Pool",
      className: classNames("bg-black-700 text-white-200 font-bold"),
    };

    const cancelButtonProps = {
      onClick: () => {
        console.log("making offer");
        setMakeOffer(false);
      },
      label: isPoolOwner ? "Disable Pool" : "Cancel",
      className: classNames({
        "bg-white-200 text-black-500 font-bold": !isPoolOwner,
        "text-[#BA1200] text-black-500 font-bold border-none w-fit-content h-fit-content bg-transparent":
          isPoolOwner,
      }),
    };

    if (isMakingOffer) return [makeOwner, cancelButtonProps];
    if (!isPoolOwner && !membershipStatus)
      return [isRequestButtonProps, makeOwner];
    if (isPoolOwner) return cancelButtonProps;
    else return isRequestButtonProps;
  }, [authData, streamService, isMakingOffer]);

  const renderModalContent = () => {
    switch (modalContentState) {
      case "init":
        return (
          <FormikProvider value={fields}>
            <ServiceDetails
              email={serviceEmail}
              streamService={streamService}
              selectedPlan={getCurrentStreamPlan()}
              isLoading={isLoading || isAuthLoading}
              pool={currentPool}
              isPoolOwner={isPoolOwner}
              buttonProps={buttonProps}
              offerBoxProps={{
                isVisible: isMakingOffer,
                onChange: (e) => {
                  console.log(e.target.value, e.target.name)
                  fields.handleChange(e);
                  console.log(fields.values)
                },
              }}
              // status="active membership"
              status={membershipStatus}
              onCancel={() => onCloseModal()}
              onSelectPlan={(plan) => setSelectedPlan(plan)}
            />
          </FormikProvider>
        );
      case "requesting_email":
        return requestEmail();
      case "requesting_payment_details":
        return renderPaymentDetailsOptions();
    }
  };

  return (
    <Layout title="Stream more for less">
      <div className=" flex sm:flex-row flex-col px-[5%] mt-10 w-full justify-between items-center ">
        <div className="flex flex-col sm:bg-transparent  rounded-xl  text-white-200 ">
          <span className=" text-[46px] leading-tight md:text-[46px] lg:text-[66px] xl:text-[76px] 2xl:text-[86px] sm:w-2/3 w-full font-bold sm:mb-2 mb-2 ">
            Stream More, for Less
          </span>
          <span className="my-6 text-[#a9abb1] text-md w-full lg:w-3/4 xl:w-3/4 2xl:w-3/4 leading-loose sm:font-medium font-bold  ">
            Feel like you're missing out on a great deal of shows cos there are
            so many streaming services and you can't afford them all? Not to
            worry, we've got you covered. Streamcel allows you to save money on
            streaming by sharing subscriptions with other users.
          </span>
          <div className=" sm:w-fit-content  w-full flex justify-start items-center ">
            <Button
              className="  flex justify-center rounded-lg items-center
    w-fit-content bg-[#49DE80]  font-bold border-none text-black-500 px-7 py-5 "
            >
              <span>Explore Services</span>
            </Button>
          </div>
        </div>
        <div className="sm:mt-0 mt-20 flex ">
          <Image
            width={800}
            height={800}
            src="/static/images/streamcel_hero_main_3.svg"
          />
        </div>
      </div>
      {/* <Banner {...bannerButtonContent} /> */}
      <section
        id="card_content_wrapper"
        className=" w-full px-[5%] flex flex-col     "
      >
        <section className="flex">
          <StreamServices />
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
      <Modal
        className=" rounded-lg "
        cancelButtonProps={{ style: { display: "none" } }}
        visible={Boolean(streamService)}
        footer={null}
        destroyOnClose={true}
        closable={false}
      >
        <div className="flex flex-col justify-center border border-[#999797] p-6 rounded-xl w-screen lg:w-[500px] overflow-auto   bg-[#242424] text-center">
          {renderModalContent()}
        </div>
      </Modal>
    </Layout>
  );
};

export default IndexPage;
