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
                style: { background: "black", border: `1px solid ${type === "error" ? "#da373d" : "#386150"}`, color: "white", fontWeight: "medium", fontSize: "8px" },
                message: <span className=" mt-20 text-base  text-white-400">{message}</span>,
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
