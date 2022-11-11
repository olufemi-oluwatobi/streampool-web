import { useState } from "react";
import Link from "next/link";
import { FormikProps } from "formik";
import { useAuthContext } from "../providers/authProvider";
import { Form, Input, Button } from "antd";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/router";
import Image from "next/image";
import { PersonalRegistrationPayload } from "../interfaces/http";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";

const { Item } = Form;

import * as Yup from "yup";
import { useNotification } from "@providers/notificationProvider";
import Checkbox from "antd/lib/checkbox/Checkbox";

const AccountCreationValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password_confirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  hasAgreedToToc: Yup.boolean().isTrue(),
  email: Yup.string().email("Invalid email").required("Required"),
  username: Yup.string().required("Required"),
});

interface FormValues {
  email: string;
  password: string;
  username: string;
  password_confirmation: string;
  hasAgreedToToc: boolean;
}

interface Props {
  handleSignUp: (
    values: PersonalRegistrationPayload
  ) => Promise<boolean | void>;
}

const LoginAccount = ({
  values,
  errors,
  isSubmitting,
  ...props
}: FormikProps<FormValues>) => {
  const handleChange = (e) => {
    const { name } = e.target;
    props.setFieldTouched(name, true);
    props.handleChange(e);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col  ">
        <Form className="w-full items-center" layout="vertical">
          <Item
            validateStatus={errors?.username ? "error" : "success"}
            help={errors?.username && errors?.username}
            label="Username"
          >
            <Input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={values.username}
              required
            />
          </Item>
          <Item
            validateStatus={errors?.email ? "error" : "success"}
            help={errors?.email && errors?.email}
            label="Email Address"
          >
            <Input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={values.email}
              type="email"
              required
            />
          </Item>
          <Item
            validateStatus={errors?.password ? "error" : "success"}
            help={errors?.password && errors?.password}
            label="Password(6 characters or more)"
          >
            <Input.Password
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={values.password}
              type="password"
              required
            />
          </Item>
          <Item
            validateStatus={errors?.password_confirmation ? "error" : "success"}
            help={
              errors?.password_confirmation && errors?.password_confirmation
            }
            label="Confirm Password"
          >
            <Input.Password
              placeholder="Confirm Password"
              name="password_confirmation"
              onChange={handleChange}
              value={values.password_confirmation}
              type="password"
              required
            />
          </Item>
        </Form>
      </div>
      <div className=" flex ">
        <Checkbox
          name="hasAgreedToToc"
          onChange={handleChange}
          checked={values.hasAgreedToToc}
        />
        <span className="ml-4 text-white-200">
          i have read and agree to the{" "}
          <a href="/terms_and_condition"> terms and conditions</a>{" "}
        </span>
      </div>
      <div className="w-full  mt-10 mb-5">
        <Button
          loading={isSubmitting}
          onClick={() => props.handleSubmit()}
          className=" text-black-500 rounded border-none border-b-0   w-full flex justify-center items-center h-12 bg-[#9DDBAD] "
        >
          <div className=" flex justify-center items-center">
            <span className="mr-5 text-lg font-bold">Sign Up</span>
          </div>
        </Button>
      </div>{" "}
      <div className="flex justify-center text-white-200 items-center mt-2">
        <div className="flex">
          <span className="">Already a member?</span>
        </div>
        <Link href="/login">
          <span className=" text-sm ml-2  text-[#9DDBAD] cursor-pointer  ">
            login
          </span>
        </Link>
      </div>
    </div>
  );
};

const IndexPage = (props: Props) => {
  const history = useRouter();
  const [isSubmitSuccesful, setSubmitSuccessful] = useState<boolean>(false);
  const { signUp } = useAuthContext();
  const { triggerNotification } = useNotification();

  const triggerLogin = async (
    data: typeof accountCreationFormik.initialValues
  ) => {
    try {
      accountCreationFormik.setSubmitting(true);
      await signUp(data);
      setSubmitSuccessful(true);
      // history.push("/");
    } catch (error) {
      const { response } = error;
      if (response) {
        const { data } = response;
        triggerNotification(data.message, data.message, "error");
      }
    } finally {
      accountCreationFormik.setSubmitting(false);
    }

    accountCreationFormik.setSubmitting(false);
  };

  const accountCreationFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
      username: "",
      hasAgreedToToc: false,
    },
    onSubmit: triggerLogin,
    validationSchema: AccountCreationValidationSchema,
  });

  const renderSuccessScreen = () => {
    return (
      <div className=" font-lato  ">
        <div className=" bg-black-700 p-[8%] md:p-[8%] lg:p-[6%]  h-screen flex justify-center ">
          <div className=" flex flex-col py-10 justify-center items-center  sm:w-1/3 w-full ">
            <div>
              <Link href="/">
                <Image
                  width="200"
                  height="30"
                  className="cursor-pointer"
                  src={"/static/images/streamcel1.png"}
                />
              </Link>
            </div>
            <div className="mt-10 py-10 px-5 bg-white-50 rounded-md flex-col flex w-full justify-center items-center ">
              <Image
                width="100"
                height="100"
                className="cursor-pointer"
                src={"/static/images/email_notif.svg"}
              />
              <span className="font-bold text-black-400 text-base my-5">
                Verify your email address
              </span>
              <span className=" text-center text-base text-black-400 mb-5">
                Please click the link that was sent to{" "}
                {accountCreationFormik.values.email} to verify your email{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return isSubmitSuccesful ? (
    renderSuccessScreen()
  ) : (
    <div className="  ">
      <div className=" bg-black-700 p-[8%] md:p-[8%] lg:p-[6%]  h-screen flex justify-center ">
        <div className=" flex flex-col py-10 justify-center items-center  sm:w-1/3 w-full ">
          <div>
            <Link href="/">
              <Image
                width="200"
                height="30"
                className="cursor-pointer"
                src={"/static/images/streamcel1.png"}
              />
            </Link>
          </div>
          <div className="mt-10 flex w-full justify-center items-center ">
            <GoogleLogin
              width="100"
              size="large"
              text="signup_with"
              onSuccess={async (credentialResponse) => {
                triggerLogin({
                  email: "",
                  password: "",
                  username: "",
                  accessToken: credentialResponse.credential,
                  authBasis: "google",
                });
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            <FormikProvider value={accountCreationFormik}>
              <LoginAccount {...accountCreationFormik} />
            </FormikProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = IndexPage;
export default Index;
