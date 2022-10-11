import React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux';
import { useTheme } from 'next-themes'
import { PersistGate } from 'redux-persist/integration/react';
import { StreamServiceProvider } from "../providers/streamServiceProvider"
import AuthProvider from "../providers/authProvider"
import { NotificationProvider } from "../providers/notificationProvider"
import {
    QueryClient,
    QueryClientProvider,
} from "react-query";
import Loader from '../components/loader';
import store, { persistor } from '../store';
import { FormWrapper, TableStyle } from "../styles/style";
import "../styles/index.css";
import "antd/dist/antd.css";
import '../styles/loader.sass'

const queryClient = new QueryClient();


declare global {
    interface Window { intercomSettings: any; }
}

const TableWrapperComp = ({ children }: any) => {
    const { theme } = useTheme()
    return (<TableStyle mode={theme}>{children}</TableStyle>)
}

const FormWrapperComponent = ({ children }: any) => {
    const { theme } = useTheme()
    return (<FormWrapper mode={theme}>{children}</FormWrapper>)
}

function MyApp({ Component, pageProps, ...props }: AppProps) {

    return (
        <div className=' font-lato '>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class">
                    <StreamServiceProvider>
                        <NotificationProvider>
                            <AuthProvider checkOnboardingStatus>
                                <TableWrapperComp>
                                    <FormWrapperComponent>
                                        <Component {...pageProps} />
                                    </FormWrapperComponent>
                                </TableWrapperComp>
                            </AuthProvider>
                        </NotificationProvider>
                    </StreamServiceProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </div>

    );
}





const App = MyApp


const Index = (props: AppProps) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Loader on />} persistor={persistor}>
                <App {...props} />
            </PersistGate>
        </Provider>
    )
}

export async function getStaticProps() {

    // Call an external API endpoint to get posts.
    // You can use any data fetching library

    return {
        props: {
        },
    }
}

export default Index