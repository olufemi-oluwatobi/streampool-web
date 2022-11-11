import { useEffect } from "react";
import Link from "next/link";
import { FormikProps } from "formik";
import Layout from "../components/Layout";
import { useAuthContext } from "../providers/authProvider";
import { useNotification } from "../providers/notificationProvider";
import { Form, Input, Button, Checkbox } from "antd";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/router";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { LoginPayload } from "../interfaces/http";
// import {
//   GoogleLogin,
//   GoogleLoginResponse,
//   useGoogleLogin,
// } from "react-google-login";

const { Item } = Form;

import * as Yup from "yup";
import jwtDecode from "jwt-decode";

const AccountCreationValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

interface FormValues {
  email: string;
  password: string;
}

interface Props {
  handleLogin: (values: LoginPayload) => Promise<boolean | void>;
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
            validateStatus={errors?.email ? "error" : "success"}
            help={errors?.email && errors?.email}
            label="Email Address"
          >
            <Input
              name="email"
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
              onChange={handleChange}
              value={values.password}
              type="password"
              required
            />
          </Item>
        </Form>
      </div>
      <div className="flex   justify-between mt-2">
        <div className="flex">
          <Checkbox /> <span className="ml-3">Remember Me</span>
        </div>
        <Link href="/forgot_password">
          <span className=" text-sm text-gray-50 cursor-pointer  ">
            Forgot password?
          </span>
        </Link>
      </div>
      <div className="w-full border-none mt-10 mb-5">
        <Button
          loading={isSubmitting}
          onClick={() => props.handleSubmit()}
          className=" text-black-500 rounded border-none   w-full flex justify-center items-center h-12 bg-[#9DDBAD] "
        >
          <div className=" flex justify-center items-center">
            <span className="mr-5 text-lg font-bold">Login</span>
          </div>
        </Button>
      </div>
      <div className="flex text-white-200   justify-center mt-2">
        <span>
          You haven't registered?{" "}
          <Link href="/signup">
            <span className=" text-sm  text-[#9DDBAD] cursor-pointer  ">
              Sign up
            </span>
          </Link>
        </span>
      </div>
    </div>
  );
};

const IndexPage = (props: Props) => {
  const history = useRouter();
  const { signIn } = useAuthContext();
  const { triggerNotification } = useNotification();
  const login = useGoogleLogin({
    // onSuccess: (e: GoogleLoginResponse) => {
    //   console.log(e);
    //   // signIn({
    //   //   email: e?.profileObj?.email,
    //   //   password: "password123",
    //   //   accessToken: e.accessToken,
    //   //   authBasis: "gmail",
    //   // });
    // },
    flow: "implicit",
    scope:
      "email profile openid https://www.googleapis.com/auth/userinfo.profile",
    onSuccess: (tokenResponse) => {
      console.log("token ===>", jwtDecode(tokenResponse.access_token));
    },
    onError: (err) => console.log(err),
  });

  const triggerLogin = async (
    data: typeof accountCreationFormik.initialValues
  ) => {
    try {
      accountCreationFormik.setSubmitting(true);
      await signIn(data);
      history.push("/");
    } catch (error) {
      const { response } = error;
      if (response) {
        const { data } = response;
        triggerNotification(data.message, data.message, "error");
      }
    } finally {
      accountCreationFormik.setSubmitting(false);
    }
  };

  const accountCreationFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (value) => await triggerLogin(value),
    validationSchema: AccountCreationValidationSchema,
  });

  const onSuccess = (response) => {};
  return (
    <Layout title="Stream more for less">
      <div className=" bg-black-700 p-[5%]  h-screen flex justify-center ">
        <div className=" flex flex-col items-center  sm:w-1/3 w-full ">
          <div className=" mt-20 flex w-full flex-col justify-center items-center ">
            {/* <Button onClick={() => login()}>Login With Google</Button> */}
            <div className="w-full google_login-wrapper mb-4">
              <GoogleLogin
                width="100%"
                theme="filled_black"
                size="large"
                onSuccess={async (credentialResponse) => {
                  await triggerLogin({
                    email: "",
                    password: "",
                    accessToken: credentialResponse.credential,
                    authBasis: "google",
                  });
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
            <FormikProvider value={accountCreationFormik}>
              <LoginAccount {...accountCreationFormik} />
            </FormikProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Index = IndexPage;
export default Index;
