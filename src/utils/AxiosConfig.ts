import axios from 'axios'
import { Cookies } from 'react-cookie';
import * as Sentry from '@sentry/react'
import { Baseurl } from './Baseurl';


const axiosInstance = axios.create({
    baseURL: Baseurl
});

const onRequestSuccess = (config: any) => {
    // console.log('Successful request')
    // console.log(config)
    let cookie = new Cookies()
    let token = cookie.get('x-auth-token')

    if(token){
        config.headers['x-auth-token'] = token
    }
    
    return config
}

const onRequestError = (err: any) => {
    // console.log('failed request')
    // console.log(err)
    const userData = JSON.parse(localStorage.getItem('userData')!)

    Sentry.setUser({
        userName: userData.username,
        id: userData._id
    });

    Sentry.captureException(err)

    return Promise.reject(err);
}

const onResponseSuccess = (response: any) => {
    // console.log(response)
    // console.log(response.headers)
    return response
}

const onResponseError = (err: any) => {

    const userData = JSON.parse(localStorage.getItem('userData')!)

    Sentry.setUser({
        userName: userData?.username,
        id: userData?._id
    });

    if (err.response && err.response.status === 400) {
        Sentry.setContext("Bad Request", {
          data: err?.response?.data,
          error: JSON.stringify(err?.response?.data),
          failingEndpoint: err?.response?.request?.responseURL,
          uniqueID: userData?.uniqueId
        });
        Sentry.captureException(err)
        throw new Error(err)
    }

    if (err.response && err.response.status === 404) {
        Sentry.setContext("404 error", {
            data: err?.response?.data,
            error: JSON.stringify(err?.response?.data),
            failingEndpoint: err?.response?.request?.responseURL,
            uniqueID: userData?.uniqueId
        });
        Sentry.captureException(err)
        throw new Error(err)
    }

    if (err.response && err.response.status === 500) {
        Sentry.setContext("Server error", {
            data: err?.response?.data,
            error: JSON.stringify(err?.response?.data),
            failingEndpoint: err?.response?.request?.responseURL,
            uniqueID: userData?.uniqueId
        });
        Sentry.captureException(err)
        throw new Error(err)
    }

    Sentry.captureException(err)

    if (err.response && err.response.status === 401) {
        let cookie = new Cookies()
        cookie.remove('x-auth-token', { path: '/app'})
        localStorage.clear();
    }
    return Promise.reject(err);
}

axiosInstance.interceptors.request.use(onRequestSuccess, onRequestError);
axiosInstance.interceptors.response.use(onResponseSuccess, onResponseError);

export default axiosInstance;