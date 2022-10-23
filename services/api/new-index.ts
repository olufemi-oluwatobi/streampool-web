import axios, { Axios, AxiosRequestHeaders } from "axios";


class BaseApi {
    request: Axios
    headers: AxiosRequestHeaders
    loadRequest() {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        this.loadHeaders()
        this.request = axios.create({
            baseURL: baseUrl,
            headers: this.headers
        });
    }
    loadHeaders() {
        try {
            if (this.headers) return this.headers;
            const headers: AxiosRequestHeaders = {};
            if ((typeof window !== 'undefined')) {
                const authDataSerialized = window.localStorage.getItem("AuthData");
                const authData = JSON.parse(authDataSerialized);
                if (authDataSerialized) {
                    headers.Authorization = `${authData?.token?.type} ${authData?.token?.token}`;
                }
                this.headers = headers;
                return headers;
            }

        } catch (error) {
            console.log(error)
        }
    }
}

export default BaseApi;
