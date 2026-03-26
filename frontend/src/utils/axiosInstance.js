import axios from "axios";
import { BASE_URL } from "./apiPaths.js";


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})
//request interceptor

axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            if(error.response.status === 401){
                //redirect to login
                // window.location.href = '/';
            }
            else if(error.response.status === 500){
                console.error('Server error. Pls try again later');
            }
        }
        else if(error.code === "ECONNABORTED"){
            console.error('Request timeout, pls try again.')
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;
