const props = () => {
    return (<div />)
}

export default props


// import { useEffect } from 'react'
// import Link from "next/link";
// import { FormikProps } from "formik";
// import { handleUserLogin, handleForgotPassword } from '../store/actions/handleUserActions'
// import { connect } from 'react-redux'
// import { NotifyService } from '../services'
// import { Form, Input, Button, Checkbox } from "antd";
// import { FormikProvider, useFormik } from "formik";
// import withAuth from "../utils/auth/withAuth";
// import { useRouter } from 'next/router'
// import Image from "next/image";
// import { LoginPayload, ForgotPasswordPayload } from "../interfaces/http";
// import Logo from "../assets/images/logo/logo.svg";
// import ApiSample from "../assets/images/api_sample.svg";
// import TwinkleIcon from "../assets/images/icons/twinkle.svg";
// import TwinkleWhiteIcon from "../assets/images/icons/twinkle_white.svg";
// import MessageIcon from "../assets/images/icons/message_icon.svg";
// import LoginAvatarIcon from "../assets/images/icons/login_avatar_illustration.svg";
// import ShieldIcon from "../assets/images/icons/shield.svg";
// import Head from "next/head";

// const { Item } = Form;

// import * as Yup from "yup";

// const AccountCreationValidationSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email").required("Required"),
// });

// interface FormValues {
//     email: string;
// }

// interface Props {
//     handleLogin: (values: LoginPayload) => Promise<boolean | void>;
//     handleForgotPassword: (values: ForgotPasswordPayload) => Promise<boolean | void>;
//     // setLoading: (state: boolean) => void;
//     // headerText?: string,
//     // supportingText?: string,
//     // loading: boolean;
//     // onSuccess?: () => void | undefined,
//     // triggerSignup?: () => void | undefined,

// };

// const LoginAccount = ({
//     values,
//     errors,
//     ...props
// }: FormikProps<FormValues>) => {
//     const handleChange = (e) => {
//         const { name } = e.target;
//         props.setFieldTouched(name, true);
//         props.handleChange(e);
//     };
//     return (
//         <div className="w-full">
//             <div className="flex flex-col  ">
//                 <Form className="w-full items-center" layout="vertical">
//                     <Item
//                         validateStatus={errors?.email ? "error" : "success"}
//                         help={errors?.email && errors?.email}
//                         label="Email Address"
//                     >
//                         <Input
//                             prefix={<Image src={MessageIcon} />}
//                             name="email"
//                             onChange={handleChange}
//                             value={values.email}
//                             type="email"
//                             required
//                         />
//                     </Item>
//                 </Form>
//             </div>
//             <div className="flex   justify-between mt-5">
//                 <div className="flex">
//                     <Checkbox /> <span className="ml-3">Remember Me</span>
//                 </div>
//                 <Link href="/">
//                     <span className=" text-sm text-gray-50 cursor-pointer  ">
//                         Forgot password?
//                     </span>
//                 </Link>
//             </div>
//             <div className="w-full border-b  mt-5 mb-5">
//                 <Button
//                     onClick={() => props.handleSubmit()}
//                     className=" text-white-50 rounded border-none   w-full flex justify-center items-center h-14 bg-blue-400 "
//                 >
//                     <div className=" flex justify-center items-center">
//                         {" "}
//                         <span className="mr-5">Reset Password</span>
//                         <div>
//                             <Image
//                                 color="#fff"
//                                 width="12px"
//                                 height="12px"
//                                 src={TwinkleWhiteIcon}
//                             />
//                         </div>
//                     </div>
//                 </Button>
//             </div>{" "}
//         </div>
//     );
// };

// const IndexPage = (props: Props) => {
//     const history = useRouter();



//     const accountCreationFormik = useFormik({
//         initialValues: {
//             email: "",
//         },
//         onSubmit: (values) => {
//             props.handleForgotPassword(values).then(async success => {
//                 if (success) {
//                     NotifyService
//                         .setTitle('Success')
//                         .setMessage('Password Reset Successful, Kindly check your email')
//                         .success()
//                 }
//             })
//         },
//         validationSchema: AccountCreationValidationSchema,
//     });

//     return (
//         <div
//             className="  "
//         >
//             <Head>
//                 <title>Digiftng | Forgot Password</title>
//                 <meta charSet="utf-8" />
//                 <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//             </Head>
//             <div className="   justify-center bg-white-50  items-center w-screen p-[8%] md:p-[8%] lg:p-[6%]  h-screen flex ">
//                 <div className=" flex flex-col sm:w-1/3 w-full ">
//                     <span className=" mb-9 font-extrabold sm:text-5xl text-3xl w-full text-center sm:leading-[48px] leading-10 ">
//                         Forgot Your Password
//                     </span>
//                     <FormikProvider value={accountCreationFormik}>
//                         <LoginAccount
//                             {...accountCreationFormik}
//                         />
//                     </FormikProvider>
//                 </div>

//             </div>
//         </div>
//     );
// };

// const mapDispatchToProps = { handleLogin: handleUserLogin, handleForgotPassword }
// const Index = connect(null, mapDispatchToProps)(IndexPage);
// export default withAuth(Index, false)