import Header from '../components/layout/Header'
import Incognito from '../assets/images/incognito.png'
import Button from '../components/shared/Button'
import { Link } from 'react-router-dom'
import { Cookies, useCookies } from 'react-cookie';
import * as Sentry from '@sentry/react'
import { useEffect } from 'react';
import { getTokenFromFirebase } from '../utils/firebase';

//redirect to feed back if user is logged in
function Home() {
    
    const [, setCookie] = useCookies();

    let cookie = new Cookies()
    let token = cookie.get('x-auth-token')
    const user = JSON.parse(localStorage.getItem('userData')!)


    async function name() {
        let deviceToken = await getTokenFromFirebase()
        setCookie('x-device-token', token, { maxAge: 864000, path: '/' });
        console.log(deviceToken)
    }
    useEffect(() => {
        name()
    }, [])



    const shareLink = async () => {
        if (navigator.share) {
            navigator.share({
                title: 'Anon',
                text: 'Check out this cool app for sending anonymous messages!',
                url: `${location.origin}`,
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
                    page: 'Home',
                    uniqueID: user?.uniqueId
                });
                Sentry.captureException(error)
            });
        }
    };
    

    return (
        <main className='pinkgradient text-white mx-auto h-[100vh]'>
            <Header linkText={!token ? 'Login' : 'Go to app'} link={!token ? '/login' : '/app/messages'} showLink={true}/>
            <div className='md:max-w-lg md:mx-auto h-[75vh] flex flex-col items-center justify-center'>
                <div className=' mx-auto text-center px-6'>
                    <img src={Incognito} className='mx-auto '/>
                    <p className='text-xl text-center leading-relaxed mt-14 w-[300px] md:w-[350px] mx-auto'>
                        {
                            !token && 'Hey 👋 welcome to the Anon app. Using Anon, you can send and receive anonymous messages from anyone.'
                        }
                        {
                            token && <span>
                                {`Hey @${user.username} 👋 Thanks for trying out Anon. `}
                                {/* <Link to='https://twitter.com/lady_catheryn' className='text-lilac underline'>Twitter </Link> */}
                                You can leave anonymous feedback&nbsp;
                                <span className='underline cursor-pointer text-lilac'>
                                    <Link to='https://anon-app.vercel.app/khaleesi'>
                                        here
                                    </Link>
                                </span> : )
                            </span>
                        }
                    </p>
                    <div className='mt-14 w-full md:w-72 md:mx-auto'>
                        {
                            !token && <Button><Link to='/register'> Start now </Link></Button>
                        }
                        {
                            token && <Button onClick={shareLink}> Share Anon with your friends &#128515;</Button>
                        }
                    </div>
                    {
                        !token &&
                        <p className='mt-5 underline'>
                            <Link to='/app/messages'> I'll Pass, here to look around. </Link>
                        </p>
                    }
                </div>
            </div>
        </main>
    )
}

export default Home