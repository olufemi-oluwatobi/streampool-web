const props = () => {
    return (<div />)
}

export default props

// import Link from "next/link";
// import { FormikProps } from "formik";
// import { handleUserLogin, resetPassword, } from '../store/actions/handleUserActions'
// import { connect } from 'react-redux'
// import { NotifyService } from '../services'
// import { Form, Input, Button, Checkbox } from "antd";
// import { FormikProvider, useFormik } from "formik";
// import withAuth from "../utils/auth/withAuth";
// import { useRouter } from 'next/router'
// import Image from "next/image";
// import { LoginPayload, ResetPasswordPayload, ResetPasswordHeaders } from "../interfaces/http";
// import TwinkleWhiteIcon from "../assets/images/icons/twinkle_white.svg";
// import Head from "next/head";

// const { Item } = Form;

// import * as Yup from "yup";

// const AccountCreationValidationSchema = Yup.object().shape({
//     password: Yup.string()
//         .min(2, "Too Short!")
//         .max(50, "Too Long!")
//         .required("Required"),
// });

// interface FormValues {
//     email: string;
// }

// interface Props {
//     handleLogin: (values: LoginPayload) => Promise<boolean | void>;
//     handleResetPassword: (values: ResetPasswordPayload, headers: ResetPasswordHeaders) => Promise<boolean | void>;
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
// }: FormikProps<ResetPasswordPayload>) => {

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
//                         validateStatus={errors?.password ? "error" : "success"}
//                         help={errors?.password && errors?.password}
//                         label="Password"
//                     >
//                         <Input
//                             name="password"
//                             onChange={handleChange}
//                             value={values.password}
//                             type="password"
//                             required
//                         />
//                     </Item>
//                     <Item
//                         validateStatus={errors?.password_confirmation ? "error" : "success"}
//                         help={errors?.password_confirmation && errors?.password_confirmation}
//                         label="Confirm Password"
//                     >
//                         <Input
//                             name="password_confirmation"
//                             onChange={handleChange}
//                             value={values.password_confirmation}
//                             type="password"
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
//     const { query } = history




//     const accountCreationFormik = useFormik({
//         initialValues: {
//             password_confirmation: "",
//             password: ""
//         },
//         onSubmit: (values) => {
//             props.handleResetPassword(values, query as ResetPasswordHeaders).then(async success => {
//                 if (success) {
//                     NotifyService
//                         .setTitle('Success')
//                         .setMessage('Password Reset Successful')
//                         .success()
//                     history.push('/')
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
//                         Reset Your Password
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

// const mapDispatchToProps = { handleLogin: handleUserLogin, handleResetPassword: resetPassword }
// const Index = connect(null, mapDispatchToProps)(IndexPage);
// export default withAuth(Index, false)