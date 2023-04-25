// import axios from 'axios'
import axios from '../utils/AxiosConfig'
import axiosOrdinary from 'axios'
import { Baseurl } from '../utils/Baseurl';

export const getCurrentUser = async (): Promise<any> => {
    let response = await axios.get(`/account/get-current-user`)
    localStorage.setItem('userData', JSON.stringify(response.data.data))
    
    return response.data.data
};

export const getUserMessages = async (id:string, page:string): Promise<any> => {
    const url = new URL(`${Baseurl}/message/${id}`)
    url.searchParams.set('page', page!)
    url.searchParams.set('limit', '20')
    
    let response = await axiosOrdinary.get(`${url}`)
    if(response.status === 204){
        return []
    }
    return response.data.data
};

export const getUserByCode = async (id:string): Promise<any> => {
    let response = await axios.get(`/account/get-user-by-code/${id}`)
    return response.data.data
};

export const getUserByUsername = async (username:string): Promise<any> => {
    let response = await axios.get(`/account/get-user-by-username/${username}`)
    return response.data.data
};

export const getUsersByVisibility = async (search:string, page:string): Promise<any> => {
    const url = new URL(`${Baseurl}/account/get-users-by-visibility`)
    if(search !== ''){
        url.searchParams.set('username', search!)
    }
    url.searchParams.set('page', page!)
    url.searchParams.set('limit', '20')
    
    let response = await axiosOrdinary.get(`${url}`)
    if(response.status === 204){
        return []
    }
    return response.data.data
};


export const sendMessage = async (data:any): Promise<any> => {
    let response = await axios.put(`/message`, data)
    return response.data
};

export const updateProfile = async (data:any): Promise<any> => {
    let response = await axios.put(`/settings/toggle`, data)
    return response.data.data
};


