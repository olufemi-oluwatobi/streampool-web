import axios, { Axios, AxiosRequestHeaders } from "axios";


class BaseApi {
    request: Axios
    headers: AxiosRequestHeaders
    constructor() {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        this.loadHeaders()
        console.log(this.headers)
        this.request = axios.create({
            baseURL: baseUrl,
            headers: this.headers
        });
    }
    loadHeaders() {
        try {
            if (this.headers) return this.headers;
            const headers: AxiosRequestHeaders = {};
            const authDataSerialized = localStorage.getItem("AuthData");
            const authData = JSON.parse(authDataSerialized);
            if (authDataSerialized) {
                headers.Authorization = `${authData?.token?.type} ${authData?.token?.token}`;
            }
            this.headers = headers;
            return headers;
        } catch (error) {
            console.log(error)
        }
    }
}

export default BaseApi;
