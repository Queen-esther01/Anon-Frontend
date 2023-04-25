import React, { useEffect, useRef, useState } from 'react'
import { Cookies, useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import * as Sentry from '@sentry/react'
import Empty from '../../assets/images/no-message.svg'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, updateProfile } from '../../api/App';
import { toast } from 'react-hot-toast';



function Settings() {


    let cookie = new Cookies()
    let token = cookie.get('x-auth-token')
    const queryClient = useQueryClient()
    const location = new URL(window.location.href)


    const [activeTheme, setactiveTheme] = useState<string>()
    const [cookies, setCookie, removeCookie] = useCookies(['x-auth-token']);


    const { data:user } = useQuery({
        queryKey: ['current-user'],
        queryFn: () => getCurrentUser(),
        enabled: !!token
    })

    
    const visibilityRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if(user){
            setactiveTheme(user.theme)
            if(visibilityRef.current !== null){
                visibilityRef.current.checked = user?.isPublic
            }
        }
    }, [user])
    

    const mutation = useMutation({
        mutationFn: (data:any) => updateProfile(data),
        onError: () => {
            toast.error('Update failed')
        },
        onSuccess: (data) => {
            toast.success('Profile updated')
            queryClient.invalidateQueries({ queryKey: ['current-user'] })
            queryClient.invalidateQueries({ queryKey: ['get-users-by-visibility'] })
        }
    })
    
    

    const changeTheme = (theme:string) => {
        const data = {
            userId: user._id,
            theme: theme
        }
        mutation.mutate(data)
    }

    const changeVisibility = ({target: {checked}}: { target: { checked: boolean}}) => {
		const data = {
            userId: user._id,
            status: checked
        }
        mutation.mutate(data)
	}

    // const copyToClipboard = async () => {
    //     try {
    //         await navigator.clipboard.writeText(`${location.origin}/${user.uniqueId}`);
    //         toast.success('Link copied')
    //     } catch (error:any) {
    //         throw new Error(error);
    //     }
    // };


    const shareLink = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Anon',
                text: `Send @${user.username} anonymous messages on Anon`,
                url: `${location.origin}/${user.username}`,
            })
            .then(() => console.log(''))
            .catch((error) => {
                Sentry.setUser({
                    userName: user?.username,
                    id: user?._id
                });
                Sentry.setContext("Failed Share", {
                    data: error,
                    error: JSON.stringify(error),
                    page: 'RegisterSuccess',
                    uniqueID: user?.uniqueId
                });
                Sentry.captureException(error)
            });
        }
    };


    const logout = () => {
        removeCookie('x-auth-token', { path: '/'})
        localStorage.clear()
    }



    return (
        <div>
            {
                !token &&
                <div className='mx-auto text-center mt-28 md:w-96'>
                    <img src={Empty} className='mx-auto text-center' />
                    <p className='mt-10 tracking-wider'>You do not have access to settings because are not logged in.</p>
                    <p className='text-lilac underline mt-6 cursor-pointer'>
                        <Link to='/login'>Login</Link>
                    </p>
                </div>
            }
            {
                token && 
                <div className=' lg:mt-10 lg:max-w-lg'>
                    <h2 className=' mt-5 md:mt-20 lg:mt-0 tracking-wider text-xl text-center lg:text-left mb-10'>Settings</h2>
                    <div className='messages h-[55vh] lg:h-fit overflow-y-auto'>
                        <div className='border-b pb-8'>
                            <h3>Change theme</h3>
                            <div className='flex gap-6 mt-6'>
                                <div onClick={() => changeTheme('pinkgradient')} className={`${activeTheme === 'pinkgradient' && 'border-2'} pinkgradienttheme cursor-pointer w-14 h-10 rounded-md`}></div>
                                <div onClick={() => changeTheme('bluegradient')} className={`${activeTheme === 'bluegradient' && 'border-2'} bluegradienttheme cursor-pointer w-14 h-10 rounded-md`}></div>
                            </div>
                        </div>
                        <div className='border-b pb-10 mt-8'>
                            <h3>Change profile visibility</h3>
                            <div className='flex items-center text-sm gap-6 mt-6'>
                                <span>Private</span>
                                <label className="switch">
                                    <input ref={visibilityRef} type="checkbox" name='visibility' onChange={changeVisibility} />
                                    <span className="slider"></span>
                                </label>
                                <span>Public</span>
                            </div>
                        </div>
                        <div className='pb-10 mt-8'>
                            <h3>Share link</h3>
                            <div className='cursor-pointer text-sm gap-6 mt-6'>
                                <p onClick={shareLink} className='text-lilac'>{ `${location.origin}/${user?.uniqueId}` }</p>
                            </div>
                        </div>
                        <div className='pb-10 cursor-pointer lg:mt-10'>
                            <p onClick={logout} className='text-center text-red font-medium'>Logout</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Settings