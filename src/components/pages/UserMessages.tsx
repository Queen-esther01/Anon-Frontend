import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Empty from '../../assets/images/no-message.svg'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { getUserByCode, getUserMessages } from '../../api/App'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
import { IMessage } from '../../interface/interfaces'
dayjs.extend(localizedFormat)

function UserMessages() {

    const location = useLocation()
    const { id } = useParams()
    const navigate = useNavigate()


    const { data:user, isLoading } = useQuery({
        queryKey: ['get-user-by-code'],
        queryFn: () => getUserByCode(id!),
        enabled: !!id
    })


    const { isLoading:messageLoading, data, isError, fetchNextPage, hasNextPage, isFetchingNextPage,} = useInfiniteQuery({
        queryKey: ['messages'],
        queryFn: ({ pageParam = 1 }) => getUserMessages(user._id, pageParam),
        getNextPageParam: (lastPage) => lastPage.next ? lastPage.next.page : undefined,
        enabled: !!user
    })


    const loadMore = () => {
        fetchNextPage()
    }


    const goBack = () => {
        navigate(-1)
    }


    return (
        <div>
            {
                (isLoading || messageLoading) && !isError &&
                <div className='messages h-[55vh] overflow-y-auto mt-10 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 '>
                    {
                        new Array(9).fill(10).map((_, index) => (
                            <div key={index} className='h-[100px] rounded-md bg-lilac animate-pulse'></div>
                        ))
                    }
                </div>
            }
            {
                data?.pages[0]?.length === 0 &&
                <div className='mx-auto text-center pt-20 w-64'>
                    <img src={Empty} className='mx-auto text-center' />
                    <p className='mt-10 tracking-wider'>This user does not have any anonymous message</p>
                </div>
            }
            {
                !messageLoading && !isLoading && data?.pages[0]?.results?.length! > 0 &&
                <div>
                    <h2 onClick={goBack} className='cursor-pointer flex items-center gap-6 mt-5 md:mt-20 lg:mt-10 tracking-wider text-xl text-center mb-10'>
                        <MdOutlineKeyboardBackspace size={25}/>
                        {location?.state?.username}'s messages
                    </h2>
                    <div className='messages h-[55vh] lg:h-[75vh] overflow-y-auto '>
                        <div className='mx-auto  grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6'>
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
        </div>
    )
}

export default UserMessages