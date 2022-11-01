import Link from "next/link";
import { FormikProps } from "formik";
import { useAuthContext } from "../providers/authProvider";
import { Form, Input, Button } from "antd";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/router";
import Image from "next/image";
import { PersonalRegistrationPayload } from "../interfaces/http";
import MessageIcon from "../assets/images/icons/message_icon.svg";
import ShieldIcon from "../assets/images/icons/shield.svg";

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
              prefix={<Image src={MessageIcon} />}
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
              prefix={<Image src={ShieldIcon} />}
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
  const { signUp } = useAuthContext();
  const { triggerNotification } = useNotification();
  const accountCreationFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
      username: "",
      hasAgreedToToc: false,
    },

    onSubmit: async (values) => {
      try {
        accountCreationFormik.setSubmitting(true);
        await signUp(values);
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

      accountCreationFormik.setSubmitting(false);
    },
    validationSchema: AccountCreationValidationSchema,
  });

  return (
    <div className="  ">
      <div className=" bg-black-700 p-[8%] md:p-[8%] lg:p-[6%]  h-screen flex justify-center ">
        <div className=" flex flex-col justify-center items-center  sm:w-1/3 w-full ">
          <div>
            <Link href="/">
              <Image
                width="130"
                height="30"
                className="cursor-pointer"
                src={"/static/images/streamcel1.png"}
              />
            </Link>
          </div>
          <div className="mt-10 flex w-full justify-center items-center ">
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
