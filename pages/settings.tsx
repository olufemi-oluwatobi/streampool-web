import { useMemo, useEffect } from "react";
import HeaderBanner from "@components/pageBanner";
import AuthService from "@services/auth";
import { FormikProps, FormikProvider, useFormik } from "formik";
import useBankList from "@hooks/useBanks";
import { Form, Input, Button, Modal, Select } from "antd";
import Layout from "../components/Layout";
import { useAuthContext } from "../providers/authProvider";
import { useNotification } from "../providers/notificationProvider";
import withAuth from "../utils/auth/withAuth";

const { Item } = Form;

const { confirm } = Modal;

import * as Yup from "yup";

const AccountVerificationSchemaValidation = Yup.object().shape({
  password: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email"),
  username: Yup.string(),
  bank: Yup.string(),
  accountName: Yup.string(),
  accountNumber: Yup.string(),
});

interface FormValues {
  email: string;
  password: string;
  username: string;
  bank: string;
  accountName: string;
  accountNumber: string;
}

const PaymentCard = ({
  last4digits,
  cardType,
  onDelete,
}: {
  last4digits: string;
  cardType: "visa" | "mastercard" | "verve";
  onDelete: () => void;
}) => {
  const cardIcons = {
    verve: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="30"
        viewBox="0 0 141.732 141.732"
      >
        <g fill="#2566af">
          <path d="M62.935 89.571h-9.733l6.083-37.384h9.734zM45.014 52.187L35.735 77.9l-1.098-5.537.001.002-3.275-16.812s-.396-3.366-4.617-3.366h-15.34l-.18.633s4.691.976 10.181 4.273l8.456 32.479h10.141l15.485-37.385H45.014zM121.569 89.571h8.937l-7.792-37.385h-7.824c-3.613 0-4.493 2.786-4.493 2.786L95.881 89.571h10.146l2.029-5.553h12.373l1.14 5.553zm-10.71-13.224l5.114-13.99 2.877 13.99h-7.991zM96.642 61.177l1.389-8.028s-4.286-1.63-8.754-1.63c-4.83 0-16.3 2.111-16.3 12.376 0 9.658 13.462 9.778 13.462 14.851s-12.075 4.164-16.06.965l-1.447 8.394s4.346 2.111 10.986 2.111c6.642 0 16.662-3.439 16.662-12.799 0-9.72-13.583-10.625-13.583-14.851.001-4.227 9.48-3.684 13.645-1.389z" />
        </g>
        <path
          d="M34.638 72.364l-3.275-16.812s-.396-3.366-4.617-3.366h-15.34l-.18.633s7.373 1.528 14.445 7.253c6.762 5.472 8.967 12.292 8.967 12.292z"
          fill="#e6a540"
        />
        <path fill="none" d="M0 0h141.732v141.732H0z" />
      </svg>
    ),
    visa: (
      <svg
        width="40"
        height="30"
        viewBox="0 0 160 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_827_243)">
          <path
            d="M69.6911 48.2156H56.8417L64.8786 1.66327H77.7274L69.6911 48.2156Z"
            fill="white"
          />
          <path
            d="M116.271 2.80131C113.737 1.85939 109.717 0.819397 104.746 0.819397C92.0569 0.819397 83.1213 7.15811 83.0665 16.2206C82.9611 22.9068 89.4641 26.6205 94.3279 28.8499C99.2992 31.128 100.989 32.615 100.989 34.6456C100.938 37.7643 96.972 39.2018 93.2725 39.2018C88.1425 39.2018 85.3937 38.4607 81.2164 36.7256L79.5244 35.9818L77.7263 46.4318C80.74 47.718 86.2924 48.8593 92.0569 48.9094C105.539 48.9094 114.317 42.6687 114.421 33.0112C114.472 27.7119 111.038 23.6513 103.635 20.3332C99.1411 18.2031 96.3888 16.7669 96.3888 14.5875C96.4415 12.6062 98.7167 10.5769 103.79 10.5769C107.967 10.4775 111.036 11.4181 113.361 12.3594L114.524 12.8537L116.271 2.80131Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M139.271 1.66327H149.21L159.577 48.2149H147.679C147.679 48.2149 146.515 42.8662 146.146 41.2318H129.648C129.171 42.4693 126.952 48.2149 126.952 48.2149H113.469L132.555 5.52574C133.878 2.50448 136.206 1.66327 139.271 1.66327ZM138.479 18.6989C138.479 18.6989 134.407 29.0495 133.349 31.7238H144.03C143.501 29.3963 141.068 18.2532 141.068 18.2532L140.17 14.242C139.792 15.2749 139.245 16.695 138.876 17.6528C138.626 18.3021 138.458 18.739 138.479 18.6989Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M33.5254 33.4075L46.1092 1.66327H59.6964L39.4993 48.1662H25.9114L14.4587 7.71634C10.5072 5.55224 5.99748 3.81174 0.955322 2.60389L1.16682 1.66328H21.8403C24.6425 1.76136 26.9163 2.60323 27.6562 5.57643L32.1492 26.966C32.1495 26.9671 32.1499 26.9682 32.1503 26.9694L33.5254 33.4075Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_827_243">
            <rect width="160" height="49" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    mastercard: (
      <svg
        width="40"
        height="30"
        viewBox="0 0 128 79"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48.9326 39.645C48.9326 27.191 54.812 16.0974 63.9676 8.94816C57.2723 3.72031 48.8225 0.599983 39.6392 0.599983C17.8988 0.599983 0.275757 18.0808 0.275757 39.645C0.275757 61.2093 17.8988 78.6901 39.6392 78.6901C48.8225 78.6901 57.2723 75.5697 63.9676 70.3419C54.812 63.1927 48.9326 52.099 48.9326 39.645Z"
          fill="#EB001B"
        />
        <path
          d="M127.625 39.645C127.625 61.2093 110.002 78.6901 88.2613 78.6901C79.0781 78.6901 70.6282 75.5697 63.9304 70.3419C73.0886 63.1927 78.968 52.099 78.968 39.645C78.968 27.191 73.0886 16.0974 63.9304 8.94816C70.6282 3.72031 79.0781 0.599983 88.2613 0.599983C110.002 0.599983 127.625 18.0808 127.625 39.645Z"
          fill="#F79E1B"
        />
      </svg>
    ),
  };
  return (
    <div className="flex w-full mb-6 justify-between items-center  py-2 px-4 rounded-sm    bg-[#26282c] text-center">
      <div className="flex justify-start items-center">
        {cardIcons[cardType]}
        <span className="ml-4 text-white-200 ">
          **** **** **** {last4digits}
        </span>
      </div>
      <button
        onClick={() => onDelete()}
        className="w-fit-content flex justify-center border-none bg-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 text-[#d9363e] h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
};

const UpdateProfile = ({
  values,
  errors,
  isSubmitting,
  ...props
}: FormikProps<FormValues>) => {
  const {
    authData,
    deleteAuthorization,
    addPaymentDetails,
    fetchUserCardDetails,
  } = useAuthContext();
  const { triggerNotification } = useNotification();
  const banks = useBankList();
  const handleChange = (e) => {
    const { name } = e.target;
    props.setFieldTouched(name, true);
    props.handleChange(e);
  };

  const verifyAccount = async (accountNumber: string, bankName: string) => {
    try {
      const bank = banks.find((b) => b.name === bankName);
      if (!bank) return;
      const { data } = await AuthService.verifyAccount(
        accountNumber,
        bank.code
      );
      handleChange({
        target: {
          name: "accountName",
          value: data?.data.account_name,
        },
      });
    } catch (error) {
      handleChange({
        target: {
          name: "accountName",
          value: "",
        },
      });
    }
  };

  const addAuthorization = () => {
    addPaymentDetails(5000, {
      onSuccess: () => {
        triggerNotification(
          "Payment Methoded Added",
          "Payment Methoded Added",
          "success"
        );
        fetchUserCardDetails();
      },
      onClose: () => {},
    });
  };

  const showDeleteConfirm = (authorizationId: string) => {
    confirm({
      title: "Are you sure delete this payment method?",
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
      content:
        'Deleting payment method means that you can"t use the card to subscribe for a membership  ',
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteAuthorization(authorizationId);
      },
    });
  };
  return (
    <div className="w-full sm:w-1/3 ">
      <div className="flex flex-col justify-center   ">
        <Form className=" justify-center  items-center" layout="vertical">
          <Item
            validateStatus={errors?.username ? "error" : "success"}
            help={errors?.username && errors?.username}
            label="Username"
          >
            <Input
              name="username"
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
              onChange={handleChange}
              value={values.email}
              type="email"
              required
            />
          </Item>
          <Item
            validateStatus={errors?.password ? "error" : "success"}
            help={errors?.password && errors?.password}
            label="Password"
          >
            <Input
              name="password"
              onChange={handleChange}
              value={values.password}
              type="password"
              required
            />
          </Item>
          <Item
            validateStatus={errors?.bank ? "error" : "success"}
            help={errors?.bank && errors?.bank}
            label="Bank"
          >
            <Select
              showSearch
              onChange={(value) => {
                handleChange({ target: { name: "bank", value } });
                if (values.accountNumber.length === 10) {
                  verifyAccount(values.accountName, value);
                }
              }}
              value={values.bank}
            >
              {banks?.map((bank) => (
                <Select.Option name="bank" value={bank.name}>
                  {bank.name}
                </Select.Option>
              ))}
            </Select>
          </Item>
          <Item
            validateStatus={errors?.accountNumber ? "error" : "success"}
            help={errors?.accountNumber && errors?.accountNumber}
            label="Account Number"
          >
            <Input
              name="accountNumber"
              onChange={async (e) => {
                handleChange(e);
                if (e.target.value.length === 10 && values.bank) {
                  verifyAccount(e.target.value, values.bank);
                }
              }}
              value={values.accountNumber}
              required
            />
          </Item>
          <Item
            validateStatus={errors?.accountName ? "error" : "success"}
            help={errors?.accountName && errors?.accountName}
            label="Account Name"
          >
            <Input
              name="accountName"
              disabled
              value={values.accountName}
              required
            />
          </Item>
        </Form>
        <div className="flex flex-col w-full">
          <span className=" text-white-200 mt-4 mb-2 ">Payment Method</span>
          {authData?.paymentDetails?.map((payment) => (
            <PaymentCard
              onDelete={() => showDeleteConfirm(payment.authorization_code)}
              last4digits={payment.last4}
              cardType={payment.card_type.trim() as "visa" | "mastercard"}
            />
          ))}
        </div>
        <Button
          loading={isSubmitting}
          onClick={() => addAuthorization()}
          className=" w-fit-content   rounded border-none mt-4 p-0   flex  bg-transparent "
        >
          <div className=" flex items-center  text-green-400 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
            <span className="text-sm">Add a new payment method</span>
          </div>
        </Button>
      </div>

      <div className="w-full flex  justify-end border-none mt-10 mb-5">
        <Button
          onClick={() => props.handleSubmit()}
          className=" text-white-200 sm:w-fit-content w-full rounded border-none    flex justify-center items-center h-10 bg-[#d9363e] "
        >
          <div className=" flex justify-center items-center">
            <span className="text-sm">Update Profile</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

const IndexPage = () => {
  const { authData, updateUser, isAuthLoading } = useAuthContext();
  const { triggerNotification } = useNotification();

  const initValues = useMemo(
    () => ({
      email: authData?.user?.email,
      password: "",
      username: authData?.user?.username,
      bank: authData?.user?.bank,
      accountName: authData?.user?.account_name,
      accountNumber: authData?.user?.account_number,
    }),
    [authData]
  );

  const accountCreationFormik = useFormik({
    initialValues: initValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (!values.accountName) {
          delete values.accountName;
          delete values.accountNumber;
          delete values.bank;
        }
        accountCreationFormik.setSubmitting(true);
        triggerNotification("Profile Changed", "Profile Updated", "success");
        updateUser(values);
      } catch (error) {
      } finally {
        accountCreationFormik.setSubmitting(false);
      }

      // signIn(values, { onSuccess: () => history.push('/'), onError: () => history.push('/') })
    },
    validationSchema: AccountVerificationSchemaValidation,
  });

  return (
    <Layout title="Creating Happiness">
      <HeaderBanner title={"Settings"} />
      <section className="mb-20">
        <section
          id="card_content_wrapper"
          className=" w-full  px-[5%] flex flex-col     "
        >
          <section className="flex w-full justify-center items-center">
            <FormikProvider value={accountCreationFormik}>
              <UpdateProfile {...accountCreationFormik} />
            </FormikProvider>
          </section>
        </section>
      </section>
    </Layout>
  );
};

export default withAuth(IndexPage);
