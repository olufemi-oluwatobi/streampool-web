// const props = () => {
//     return (<div />)
// }

// export default props

import Link from "next/link";
import { Form, Input, Button } from "antd";
import AuthService from "@services/auth";
import { FormikProvider, useFormik, FormikProps } from "formik";
import { useRouter } from "next/router";
import Image from "next/image";

const { Item } = Form;

import * as Yup from "yup";
import { useNotification } from "@providers/notificationProvider";
import { useAuthContext } from "@providers/authProvider";
const AccountCreationValidationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
    password_confirmation: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must match"
    ),
});

interface FormValues {
    email: string;
    password: string;
    password_confirmation: string;
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
                        label="Email"
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
            <div className="w-full border-b  mt-5 mb-5">
                <Button
                    loading={isSubmitting}
                    onClick={() => props.handleSubmit()}
                    className=" text-black-500 rounded border-none   w-full flex justify-center items-center h-12 bg-[#9DDBAD] "
                >
                    <div className=" flex justify-center items-center">
                        <span className="mr-5 text-lg font-bold">Reset Password</span>
                    </div>
                </Button>
            </div>
            <div className="flex text-white-200   justify-end mt-2">
                <span>
                    Already a member
                    <Link href="/login">
                        <span className=" text-sm  text-[#9DDBAD] cursor-pointer  ">
                            Login
                        </span>
                    </Link>
                </span>
            </div>
        </div>
    );
};

const IndexPage = () => {
    const { query, push } = useRouter();
    const token = query.token;

    const { triggerNotification } = useNotification();
    const { setAuthData } = useAuthContext();

    const accountCreationFormik = useFormik({
        initialValues: {
            email: "",
            password: "",
            password_confirmation: "",
        },
        onSubmit: async (values) => {
            try {
                const payload = { ...values }
                const { password } = payload
                const newPassword = password
                delete payload.password
                delete payload.password_confirmation

                accountCreationFormik.setSubmitting(true);
                const { status, data } = await AuthService.resetPassword({ ...payload, newPassword, token: token as string });

                if (data.success) {
                    triggerNotification(
                        "Password Reset Succesful",
                        "Password Reset Succesful",
                        "success"
                    );
                    setAuthData(data.data);
                    push("/")
                }
            } catch (error) {
                triggerNotification("Reset Failed", "Reset Failed", "error");
            } finally {
                accountCreationFormik.setSubmitting(false);
            }
        },
        validationSchema: AccountCreationValidationSchema,
    });

    return (
        <div className="  ">
            <div className=" bg-black-700 p-[5%] md:p-[8%] lg:p-[5%]  h-screen flex flex-col ">
                <div className="">
                    <Link href="/">
                        <Image
                            width="150"
                            height="30"
                            className="cursor-pointer"
                            src={"/static/images/streamcel1.png"}
                        />
                    </Link>
                </div>
                <div className=" flex flex-col sm:w-1/3 w-full h-full justify-center self-center items-center ">
                    <span className=" mb-5 font-extrabold text-white-200 sm:text-3xl text-2xl w-full text-center sm:leading-[48px] leading-10 ">
                        Reset Password
                    </span>
                    <FormikProvider value={accountCreationFormik}>
                        <LoginAccount {...accountCreationFormik} />
                    </FormikProvider>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
