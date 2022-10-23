import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import AuthService from "../services/auth";
import { AuthDataType } from "../interfaces/index";
import useStateCallback from "@hooks/useStateCallback";
import { usePaystackPayment } from "react-paystack";
import { useNotification } from "../providers/notificationProvider";
import update from "immutability-helper"
// import { authService } from "../services/authService";
type RequestCallback = {
    onSuccess: () => void;
    onError: (error: Error) => void;
};
type AuthContextType = {
    authData: AuthDataType | null;
    isAuthLoading: boolean;
    signIn: (
        data: { email: string; password: string, accessToken?: string, authBasis?: "gmail" },
        callback?: RequestCallback
    ) => Promise<void>;
    verifyUser: (token: string, callback?: RequestCallback) => Promise<void>;
    signUp: (
        data: { email: string; password: string; username: string }
    ) => Promise<void>;
    setAuthLoading: (data: boolean) => void;
    signOut: () => Promise<void>;
    onboardingStatus: any;
    getInitPaymentDetails: (data: any) => Promise<void>;
    initPaymentDetails: (data: any) => Promise<void>;
    fetchUserCardDetails: (email?: string) => void;
    deleteAuthorization: (email?: string) => void;
    fetchUserData: () => Promise<void>;
    addPaymentDetails: (
        amount: number,
        callback: { onSuccess: () => void; onClose: () => void }
    ) => void;
    loadStorageData: () => void
    setAuthData: (data: (v: AuthDataType) => AuthDataType | AuthDataType) => void;
};
export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const useAuthContext = () => useContext(AuthContext);

let onSuccess: () => void;
let onClose: () => void;

type InitData = {
    authData: AuthDataType | null;
    onboardingStatus: any | null;
    initPaymentDetails: any | null;
    meta: {
        isAuthLoading: boolean;
    };
};
const initialState: InitData = {
    authData: null as AuthDataType,
    onboardingStatus: null,
    initPaymentDetails: null,
    meta: {
        isAuthLoading: false,
    },
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "REQUEST_AUTH_DATA":
            return update(state, {
                meta: { $set: action.payload, }
            })
        case "SET_AUTH_DATA":
            return update(state, {
                authData: { $set: action.payload }
            })

        case "GET_AUTH_DATA":
            return update(state, {
                authData: { $set: action.payload }
            })
        default:
            return state;
    }
};

export const AuthProvider = ({ children, checkOnboardingStatus }) => {
    const [
        {
            authData,
            meta: { isAuthLoading },
        },
        dispatch,
    ] = useReducer(reducer, initialState);
    const { triggerNotification } = useNotification();
    const [hasRequestedPaymentDetails, setHasRequestedPaymentDetails] =
        useState(false);
    const [onboardingStatus, setOnboardingStatus] = useState();
    const [reference, setReference] = useState(null);
    const [paymentPrice, setPaymentPrice] = useState<null | number>(null);
    const [initPaymentDetails, setInitPayment] = useState(null);

    // const [isAuthLoading, setAuthLoading] = useState(false);

    useEffect(() => {
        fetchUserData();
        loadStorageData();
    }, []);

    const setAuthData = (
        data: (v: AuthDataType) => AuthDataType | AuthDataType
    ) => {
        dispatch({
            type: "SET_AUTH_DATA",
            payload: typeof data === "function" ? data(authData) : data,
        });
    };

    const setAuthLoading = (data) => {
        dispatch({ type: "REQUEST_AUTH_DATA", payload: data });
    };

    const config = {
        reference,
        email: authData?.user?.email,
        amount: paymentPrice,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    };

    const initializePayment = usePaystackPayment(config);

    useEffect(() => {
        initializePayment(() => {
            fetchUserCardDetails();
        }, onClose);
    }, [paymentPrice]);

    const addPaymentDetails = (
        amount: number,
        callback: { onSuccess: () => void; onClose: () => void }
    ) => {
        setReference(new Date().getTime().toString());
        setPaymentPrice(amount);
        onSuccess = callback.onSuccess;
        onClose = callback.onClose;
    };

    useEffect(() => {
        if (checkOnboardingStatus) {
            getOnboardingStatus();
        }
        if (authData && !hasRequestedPaymentDetails && !authData?.paymentDetails) {
            fetchUserCardDetails(authData?.user?.email);
        }
    }, [authData, checkOnboardingStatus]);

    const getInitPaymentDetails = async () => {
        try {
            setAuthLoading(true);
            const { data } = await AuthService.initializePayment();
            if (data.success) {
                setInitPayment(data.data);
            }
        } catch (err) {
        } finally {
            setAuthLoading(false);
        }
    };

    const getOnboardingStatus = async () => {
        try {
            //Try get the data from Async Storage
            const authDataSerialized = localStorage.getItem("UserOnboardingStatus");
            if (authDataSerialized) {
                //If there are data, it's converted to an Object and the state is updated.
                const onboardingStatus = JSON.parse(authDataSerialized);
                setOnboardingStatus(onboardingStatus);
            } else {
                const { data } = await AuthService.getOnboardingStatus();

                if (data.success) {
                    setOnboardingStatus(data.data);
                    localStorage.setItem(
                        "UserOnboardingStatus",
                        JSON.stringify(data.data)
                    );
                }
            }
        } catch (error) {
        } finally {
            //loading finished
        }
    };

    const fetchUserData = async () => {
        try {
            const { data } = await AuthService.me();
            if (data.success) {
                setAuthData(v => ({ ...v, user: data.data }));
                // callback?.onSuccess && callback?.onSuccess();
            }
            //Try get the data from Async Storage
        } catch (error) {
            //signOut();
        } finally {
            //loading finished
        }
    };

    const fetchUserCardDetails = async (
        email: string = authData?.user?.email
    ) => {
        try {
            const { data } = await AuthService.paymentInfo(email);
            if (data.status) {
                setAuthData((v) => ({
                    ...v,
                    paymentDetails: data.data.authorizations,
                }));
                setHasRequestedPaymentDetails(true);
            }
        } catch (error) {
        } finally {
            //loading finished
        }
    };

    const deleteAuthorization = async (authorizationCode: string) => {
        setAuthLoading(true);
        try {
            const { data } = await AuthService.deletePaymentMethod(authorizationCode);
            if (data.status) {
                triggerNotification(
                    "Payment Detail Deleted",
                    "Payment detail succesfully deleted",
                    "success"
                );
                fetchUserCardDetails();
            }
        } catch (error) {
            triggerNotification("failed to delete", "failed to delete", "error");
        } finally {
            setAuthLoading(false);
        }
    };

    const tokenExpired = (expiryDate: string) => {
        return (
            Math.floor(new Date().getTime() / 1000) >=
            Math.floor(new Date(expiryDate).getTime() / 1000)
        );
    };

    const loadStorageData = async () => {
        try {
            console.log("ONEEE")
            //Try get the data from Async Storage
            const authDataSerialized = localStorage.getItem("AuthData");
            if (authDataSerialized) {
                const _authData = JSON.parse(authDataSerialized);
                if (tokenExpired(_authData?.token?.expires_at)) {
                    localStorage.removeItem("AuthData");
                    return;
                }
                //If there are data, it's converted to an Object and the state is updated.
                setAuthData(_authData);
            }
        } catch (error) {
        } finally {
            //loading finished
        }
    };

    const signIn = async (
        reqData: { email: string; password: string, accessToken?: string, authBasis?: "gmail" },
    ) => {
        setAuthLoading(true);

        try {
            const { data } = await AuthService.login(reqData);
            if (data.success) {
                const _authData = data.data;
                setAuthData(_authData);
                localStorage.setItem("AuthData", JSON.stringify(_authData));
                return Promise.resolve(null);
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            setAuthLoading(false);
        }
    };

    const verifyUser = async (token: string, callback?: RequestCallback) => {
        setAuthLoading(true);

        try {
            const { data } = await AuthService.verifyUser(token);
            if (data.success) {
                callback?.onSuccess && callback?.onSuccess();
            }
        } catch (error) {
            callback?.onError && callback?.onError(error);
        } finally {
            setAuthLoading(false);
        }
    };

    const signUp = async (
        reqData: { email: string; password: string; username: string },
    ) => {
        try {
            setAuthLoading(true);
            //call the service passing credential (email and password).
            //In a real App this data will be provided by the user from some InputText components.
            const { data } = await AuthService.register({
                ...reqData,
                userRole: "basic",
            });

            if (data.success) {
                const _authData = data.data;
                setAuthData(_authData);
                localStorage.setItem("AuthData", JSON.stringify(_authData));
                return Promise.resolve()
            }

            // authService.signIn("lucasgarcez@email.com", "123456");

            //Set the data in the context, so the App can be notified
            //and send the user to the AuthStack
        } catch (error) {
            return Promise.reject(error)
        } finally {
            setAuthLoading(false);
        }
    };

    const signOut = async () => {
        //Remove data from context, so the App can be notified
        //and send the user to the AuthStack
        setAuthData(undefined);
        localStorage.removeItem("AuthData");
    };

    return (
        <AuthContext.Provider
            value={{
                authData,
                isAuthLoading,
                signIn,
                signOut,
                setAuthLoading,
                signUp,
                onboardingStatus,
                getInitPaymentDetails,
                initPaymentDetails,
                verifyUser,
                addPaymentDetails,
                fetchUserCardDetails,
                deleteAuthorization,
                fetchUserData,
                setAuthData,
                loadStorageData
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
