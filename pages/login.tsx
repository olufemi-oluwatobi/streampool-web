import { useEffect } from 'react'
import Link from "next/link";
import { FormikProps } from "formik";
import { useTheme } from "next-themes";
import { useAuthContext } from "../providers/authProvider"
import { handleUserLogin } from '..//store/actions/handleUserActions'
import { connect } from 'react-redux'
import { Form, Input, Button, Checkbox } from "antd";
import { FormikProvider, useFormik } from "formik";
import withAuth from "../utils/auth/withAuth";
import { useRouter } from 'next/router'
import Image from "next/image";
import { LoginPayload } from "../interfaces/http";

import Head from "next/head";

const { Item } = Form;

import * as Yup from "yup";

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
    // setLoading: (state: boolean) => void;
    // headerText?: string,
    // supportingText?: string,
    // loading: boolean;
    // onSuccess?: () => void | undefined,
    // triggerSignup?: () => void | undefined,

};

const LoginAccount = ({
    values,
    errors,
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
                    onClick={() => props.handleSubmit()}
                    className=" text-black-500 rounded border-none   w-full flex justify-center items-center h-12 bg-[#9DDBAD] "
                >
                    <div className=" flex justify-center items-center">

                        <span className="mr-5 text-lg font-bold">Login</span>
                    </div>
                </Button>
            </div>
            <div className="flex text-white-200   justify-center mt-2">
                <span>You haven't registered?  <Link href="/signup">
                    <span className=" text-sm  text-[#9DDBAD] cursor-pointer  ">
                        Sign up
                    </span>
                </Link></span>
            </div>
        </div>
    );
};

const IndexPage = (props: Props) => {
    const history = useRouter();
    const { signIn } = useAuthContext()


    const accountCreationFormik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: (values) => {
            signIn(values, { onSuccess: () => history.push('/'), onError: () => history.push('/') })
        },
        validationSchema: AccountCreationValidationSchema,
    });

    return (
        <div
            className="  "
        >
            <div className=" bg-black-700 p-[8%] md:p-[8%] lg:p-[6%]  h-screen flex justify-center ">
                <div className=" flex flex-col justify-center items-center  sm:w-1/3 w-full ">
                    <div>
                        <Link href="/">
                            <Image width='130' height="30" className="cursor-pointer" src={'/static/images/streamcel1.png'} />
                        </Link>

                    </div>
                    <div className="mt-10 flex w-full justify-center items-center ">
                        <FormikProvider value={accountCreationFormik}>
                            <LoginAccount
                                {...accountCreationFormik}
                            />
                        </FormikProvider>

                    </div>
                </div>

            </div>
        </div>
    );
};

const mapDispatchToProps = { handleLogin: handleUserLogin }
const Index = connect(null, mapDispatchToProps)(IndexPage);
export default Index