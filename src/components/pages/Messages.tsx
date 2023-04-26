import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { Cookies } from 'react-cookie';
import dayjs from 'dayjs'
import { Link } from 'react-router-dom';
import * as Sentry from '@sentry/react'
import { getMessaging, onMessage } from "firebase/messaging";
import { getCurrentUser, getUserMessages } from '../../api/App';
import Empty from '../../assets/images/no-message.svg'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { IMessage } from '../../interface/interfaces';
import toast from 'react-hot-toast';
dayjs.extend(localizedFormat)

//Change base url based on env -DONE
//change limit on front and back end - done
//move firebase config to .env - DONE
//setup novu prod - done
//increase token expiration time frontend - done
//remove console logs and unused declarations
//compare and update device token
//Add toggle notifications to settings
//add app to sentry to backend -done
//add app to sentry frontend - done
function Messages() {

    let cookie = new Cookies()
    let token = cookie.get('x-auth-token')
    const queryClient = useQueryClient()


    const location = new URL(window.location.href)



    const { data:user } = useQuery({
        queryKey: ['current-user'],
        queryFn: () => getCurrentUser(),
        enabled: !!token
    })


    const { isFetching, data, isError, fetchNextPage, hasNextPage, isFetchingNextPage,} = useInfiniteQuery({
        queryKey: ['messages'],
        queryFn: ({ pageParam = 1 }) => getUserMessages(user._id, pageParam),
        getNextPageParam: (lastPage) => lastPage.next ? lastPage.next.page : undefined,
        enabled: user ? true : false
    })


    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
        toast.success(`You have received a new message`)
        queryClient.invalidateQueries({ queryKey: ['messages'] })
    });


    const loadMore = () => {
        fetchNextPage()
    }


    // const copyToClipboard = async () => {
    //     try {
    //       await navigator.clipboard.writeText(`${location.origin}/${user.username}`);
    //       toast.success('Link copied')
    //     } catch (error:any) {
    //       throw new Error(error);
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

    return (
        <div className=''>
            {
                isFetching && !isError &&
                <div className='messages h-[55vh] overflow-y-auto mt-10 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 '>
                    {
                        new Array(9).fill(10).map((_, index) => (
                            <div key={index} className='h-[100px] rounded-md bg-lilac animate-pulse'></div>
                        ))
                    }
                </div>
            }
            {
                token && data?.pages[0]?.results?.length === 0 &&
                <div className='mx-auto text-center pt-20 w-64'>
                    <img src={Empty} className='mx-auto text-center' />
                    <p className='mt-10 tracking-wider'>You have not received any anonymous message</p>
                    <p onClick={shareLink} className='cursor-pointer text-lilac underline mt-6'>Share Link</p>
                </div>
            }
            {
                token && data?.pages[0]?.results?.length! > 0 &&
                <div>
                    <h2 className=' mt-5 md:mt-20 lg:mt-10 tracking-wider text-xl text-center mb-10'>Your messages</h2>
                    <div className='messages h-[58vh] lg:h-[75vh] overflow-y-auto '>
                        <div className='mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6'>
                            {
                                data?.pages?.map((page:any) => (
                                    page.results.map((value:IMessage) => (
                                        <div key={value._id} className='bg-white rounded-md py-4 px-4  text-darkblue'>
                                            <p>{ value.message }</p>
                                            <p className='mt-3 font-medium text-sm'>Date: { dayjs(value?.date).format('D-MMM-YYYY / h:mm A')}</p>
                                        </div>
                                    ))
                                ))
                            }
                        </div>
                        {
                            hasNextPage &&
                            <p onClick={loadMore} className='cursor-pointer text-center mt-5 underline text-lilac'>Load more</p>
                        }
                    </div>
                    
                </div>
            }
            {
                !token &&
                <div className='mx-auto text-center mt-28 md:w-96'>
                    <img src={Empty} className='mx-auto text-center' />
                    <p className='mt-10 tracking-wider'>You do not have access to any message because you are not logged in.</p>
                    <p className='text-lilac underline mt-6 cursor-pointer'>
                        <Link to='/login'>Login</Link>
                    </p>
                </div>
            }
        </div>
    )
}

export default Messages