import React, { createContext, useContext } from "react";
import { AxiosError } from "axios";
import { notification } from 'antd';



export declare type TypeOptions = 'info' | 'success' | 'warn' | 'error'



type ContextType = { triggerNotification: (title: string, message: string, type: TypeOptions) => void }
export const NotificationContext = createContext({} as ContextType);

export const useNotification = () => useContext(NotificationContext);


export const NotificationProvider = ({ children }) => {
    const triggerNotification = (title: string, message: string, type: TypeOptions) => {
        const openNotificationWithIcon = (notifType: TypeOptions) => {
            notification[notifType]({
                style: { background: "#9ddbad", color: "black", fontWeight: "bold", fontSize: "14px" },
                message: <span className=" mt-16  text-black-200">{message}</span>,
                placement: 'topRight',
                closeIcon: null
            });
        };

        return openNotificationWithIcon((type))
    };


    return (
        <NotificationContext.Provider
            value={{
                triggerNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
