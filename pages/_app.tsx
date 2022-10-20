import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from 'next-themes'
import { useTheme } from 'next-themes'
import { StreamServiceProvider } from "../providers/streamServiceProvider"
import AuthProvider from "../providers/authProvider"
import { NotificationProvider } from "../providers/notificationProvider"
import {
    QueryClient,
    QueryClientProvider,
} from "react-query";
import { FormWrapper, TableStyle } from "../styles/style";
import "../styles/index.css";
import "antd/dist/antd.css";
import '../styles/loader.sass'

const queryClient = new QueryClient();

import { loadGapiInsideDOM } from 'gapi-script';

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

const setUpGapi = async () => {
    const gapi = await import('gapi-script').then((pack) => pack.gapi);
    console.log("here")
    console.log("profile", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    const initClient = () => {
        gapi.client.init({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            scope: 'profile',
            plugin_name: "chat",
            'cookiepolicy': 'single_host_origin',
        });
    };
    gapi.load('client:auth2', initClient);
}

function MyApp({ Component, pageProps, ...props }: AppProps) {
    useEffect(() => {
        setUpGapi()
    }, []);
    return (
        <div className=' font-lato '>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class">
                    <StreamServiceProvider>
                        <NotificationProvider>
                            <AuthProvider checkOnboardingStatus>
                                <Component {...pageProps} />
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
        <App {...props} />
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