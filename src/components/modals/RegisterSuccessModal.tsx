import { IModal } from '../../interface/interfaces'
import { Link } from 'react-router-dom'
import Button from '../shared/Button'
import * as Sentry from '@sentry/react'
import toast from 'react-hot-toast'


function RegisterSuccessModal({ user, open, onClose}:IModal) {
    const location = new URL(window.location.href)
    //console.log(location.origin)

    
    // const copyToClipboard = async () => {
    //     // try {
    //     //   await navigator.clipboard.writeText(`${location.origin}/${id}`);
    //     //   toast.success('Link copied')
    //     // } catch (error:any) {
    //     //   throw new Error(error);
    //     // }
        
    // };

    const shareLink = async () => {
        try {
          await navigator.clipboard.writeText(`${location.origin}/${user.uniqueId}`);
          toast.success('Link copied')
        } catch (error:any) {
          throw new Error(error);
        }
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


    if(!open) return null
    return (
        <div className='fixed z-50 h-screen top-0 left-0 flex items-center justify-center w-full bg-transparent'>
            <div className='w-80 md:w-96 bg-white text-darkblue text-center rounded-md p-4 px-6 pb-10'>
                <iframe className='mx-auto' src="https://embed.lottiefiles.com/animation/74694"></iframe>
                <div className='text-center'>
                    <p className='w-full font-medium mt-2 break-all'>
                        Your profile link is<br/> 
                        <span className='font-semibold'>{location.origin}/{user.uniqueId}</span>
                    </p>
                </div>
                <Button onClick={shareLink} className='mt-8 mb-3'>Copy & Share link</Button>
                <p className='font-medium text-sm text-lilac underline'>
                    <Link to='/app/messages'>Go to app</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterSuccessModal