// import axios from 'axios'
import axios from '../utils/AxiosConfig'
import { IRegister } from '../interface/interfaces';
import { getTokenFromFirebase } from '../utils/firebase';

export const register = async (data:IRegister): Promise<any> => {
    let deviceToken = await getTokenFromFirebase()
    //console.log(deviceToken)
    const userData = data
    userData.deviceToken = deviceToken!
    let response = await axios.post(`/account/register`, userData)
    
    return response.data
};

export const login = async (data:IRegister): Promise<any> => {
    let response = await axios.post(`/account/login`, data)
    return response.data
};