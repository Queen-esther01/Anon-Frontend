import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import { HiOutlineEyeSlash } from 'react-icons/hi2'
import { HiOutlineEye } from 'react-icons/hi';
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import Header from '../../components/layout/Header'
import Button from '../../components/shared/Button'
import { IRegister, LoginInterface } from '../../interface/interfaces';
import TextInput from '../../components/shared/TextInput';
import Loader from '../../components/shared/Loader';
import { login } from '../../api/Auth';



const schema = yup.object().shape({
    username: yup.string().min(5).required(),
    password: yup.string().min(5).required(),
    deviceToken: yup.string().required(),
}).required();
function Login() {


    const [showPassword, setshowPassword] = useState<boolean>(false)
    const [, setCookie] = useCookies();
    const navigate = useNavigate()
    const queryClient = useQueryClient()


    const { handleSubmit, control, reset, formState: { errors } } = useForm<IRegister>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            password: '',
            deviceToken: ''
        }
    });
    

    const mutation = useMutation({
        mutationFn: (data: IRegister) => login(data),
        onError: (err:any) => {
            toast.error(`${err.response.data.message}`);
        },
        onSuccess: (data: any) => {
            setCookie('x-auth-token', data.data.accessToken, { maxAge: 864000, path: '/' });
            toast.success('Login successful')
            reset()
            queryClient.invalidateQueries({ queryKey: ['messages'] })
            navigate('/app/messages')
        },
    })


    const onSubmit = (data: IRegister) => {
        mutation.mutate(data)
    }


    const toggleShowPassword = () => {
        setshowPassword(!showPassword)
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <main className='pinkgradient text-white h-[100vh]'>
            <div onClick={goBack} className='pt-14 px-6 cursor-pointer'>
                <MdOutlineKeyboardBackspace size={25}/>
            </div>
            <div className='sm:max-w-sm md:max-w-md xl:max-w-lg sm:mx-auto md:h-[70vh] md:flex md:flex-col md:justify-center'>
                <Header linkText='Login' link='/login' showLink={false}/>
                <div className='px-6 mt-10'>
                    <h2 className='text-3xl'>Login</h2>
                    <p className='mt-4'>Enter username and password to login</p>
                    <form onSubmit={handleSubmit(onSubmit)} className='mt-8 flex flex-col gap-4'>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => <TextInput {...field} errors={errors} type='text' placeholder='Enter username' className='' />}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => <TextInput {...field} errors={errors} type={!showPassword ? 'password' : 'text'} icon={showPassword ? <HiOutlineEye onClick={toggleShowPassword} className='text-darkblue cursor-pointer' /> : <HiOutlineEyeSlash onClick={toggleShowPassword} className='text-darkblue cursor-pointer' />} placeholder='Enter password' className='' />}
                        />
                        <div className='mt-5 w-full md:mx-auto'>
                            <Button>
                                {
                                    mutation?.isLoading ? <Loader/>
                                    : 'Login'
                                }
                            </Button>
                        </div>
                        <p className='mt-3 text-center'>
                            <Link to='/register'> Create account </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login