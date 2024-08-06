// import axios from 'axios'
import axios from '../utils/AxiosConfig'
import { IRegister, LoginInterface } from '../interface/interfaces';
import { getTokenFromFirebase } from '../utils/firebase';
import { Cookies } from 'react-cookie';


export const register = async (data:IRegister): Promise<any> => {
    let cookie = new Cookies()
    let deviceToken = cookie.get('x-auth-token')
    if(! deviceToken){
        deviceToken = await getTokenFromFirebase()
    }
    const userData = data
    userData.deviceToken = deviceToken!
    return axios.post(`/account/register`, userData)
    .then(response => {
        return response.data
    })
    .catch ((error:{ response: { data: { message: string} }}) => {
        return Promise.reject(new Error(JSON.stringify(error.response.data.message)))
    })
};

export const login = async (data:LoginInterface): Promise<any> => {
    let response = await axios.post(`/account/login`, data)
    return response.data
};