import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import { HiOutlineEyeSlash } from 'react-icons/hi2'
import { HiOutlineEye } from 'react-icons/hi';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import { generateUsername } from "unique-username-generator";
import Header from '../../components/layout/Header'
import Button from '../../components/shared/Button'
import { RegisterInterface, IUser } from '../../interface/interfaces';
import TextInput from '../../components/shared/TextInput';
import Loader from '../../components/shared/Loader';
import { register } from '../../api/Auth';
import RegisterSuccessModal from '../../components/modals/RegisterSuccessModal';
import { MdOutlineKeyboardBackspace } from 'react-icons/md'


//refirect to app immediately after registration
const schema = yup.object().shape({
    username: yup.string().min(5).max(15).required(),
    password: yup.string().min(5).required(),
    deviceToken: yup.string(),
}).required();
function Register() {


    const [showPassword, setshowPassword] = useState<boolean>(false)
    const [showSuccessModal, setshowSuccessModal] = useState<boolean>(false)
    const [user, setuser] = useState<IUser>()
    const [, setCookie] = useCookies();
    const navigate = useNavigate()
    


    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm<RegisterInterface>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            password: '',
            deviceToken: ''
        }
    });
    

    const mutation = useMutation({
        mutationFn: (data: RegisterInterface) => register(data),
        onError: (err:any) => {
            toast.error(`${err}`);
        },
        onSuccess: (data: any) => {
            setCookie('x-auth-token', data.data.accessToken, { maxAge: 864000, path: '/' });
            setuser(data.data)
            toast.success('Registration successful')
            setshowSuccessModal(true)
            reset()
        },
    })
    //console.log(import.meta.env)

    const onSubmit = (data: RegisterInterface) => {
        mutation.mutate(data)
    }


    const toggleShowPassword = () => {
        setshowPassword(!showPassword)
    }

    
    const generateRandomUsername = () => {
        const username = generateUsername("", 0, 15);
        setValue('username', username)
    }
    
    const goBack = () => {
        navigate(-1)
    }

    
    return (
        <main className='pinkgradient text-white pb-20 sm:pb-20'>
            <RegisterSuccessModal user={user} open={showSuccessModal} onClose={() => setshowSuccessModal(false)}/>
            <div onClick={goBack} className='pt-10 px-6 cursor-pointer'>
                    <MdOutlineKeyboardBackspace size={25}/>
                </div>
            <div className='sm:max-w-sm md:max-w-md xl:max-w-lg sm:mx-auto md:h-[90vh] md:flex md:flex-col md:justify-center'>
                
                <Header linkText='Login' link='/login' showLink={false}/>
                <div className='px-6 mt-10'>
                    <h2 className='text-3xl'>Create Anon Account</h2>
                    <p className='mt-4'>Your account is created with a username and password, no personal information is stored.</p>
                    <form onSubmit={handleSubmit(onSubmit)} className='mt-8 flex flex-col gap-5'>
                        <div>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => <TextInput {...field} errors={errors} type='text' placeholder='Enter username' className='' />}
                            />
                            <p onClick={generateRandomUsername} className='underline mt-1 cursor-pointer'>Generate random username</p>
                        </div>
                        <div>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => <TextInput {...field} errors={errors} type={!showPassword ? 'password' : 'text'} icon={showPassword ? <HiOutlineEye onClick={toggleShowPassword} className='text-darkblue cursor-pointer' /> : <HiOutlineEyeSlash onClick={toggleShowPassword} className='text-darkblue cursor-pointer' />} placeholder='Enter password' className='' />}
                            />
                            <p className='mt-1'>Note: there is no means to change password if you forget it.</p>
                        </div>
                        <div className='mt-5 w-full md:mx-auto'>
                            <Button>
                                {
                                    mutation?.isLoading ? <Loader/>
                                    : 'Create account'
                                }
                            </Button>
                        </div>
                        <p className='mt-3 text-center'>
                            <Link to='/login'> Login </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Register
