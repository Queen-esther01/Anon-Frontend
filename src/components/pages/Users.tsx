import React, { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs'
import { FiSearch } from 'react-icons/fi'
import { getUsersByVisibility } from '../../api/App';
import Empty from '../../assets/images/no-message.svg'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '../../interface/interfaces';
dayjs.extend(localizedFormat)


const schema = yup.object().shape({
    string: yup.string(),
}).required();
function Users() {

    const navigate = useNavigate()


    const [search, setsearch] = useState<string>('')


    const { control, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            search: '',
        }
    });


    const { isFetching, data, isError, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['get-users-by-visibility', search],
        queryFn: ({ pageParam = 1 }) => getUsersByVisibility(search, pageParam),
        getNextPageParam: (lastPage) => lastPage.next ? lastPage.next.page : undefined,
    })

    const loadMore = () => {
        fetchNextPage()
    }
    

    const navigateToUserPage = (id:string, username: string) => {
        navigate(`/app/users/${id}`, { state: { username } })
    }


    const searchData = watch('search')
    let searchDebounce: string | number | NodeJS.Timeout | undefined
    useEffect(() => {
        searchDebounce = setTimeout(() => {
            setsearch(searchData)
        }, 500);
        return () => clearTimeout(searchDebounce)
    },[searchData])



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
                data?.pages[0]?.length === 0 &&
                <div className='mx-auto text-center pt-20'>
                    <img src={Empty} className='mx-auto text-center' />
                    <p className='mt-10 tracking-wider'>There are no public users right now</p>
                    <Link to='/app/settings'>
                        <p className='text-lilac underline mt-6'>Set the pace & change profile to public : )</p>
                    </Link>
                </div>
            }
            {
                !isFetching && data?.pages[0]?.results?.length! > 0 &&
                <div className=''>
                    <h2 className=' mt-5 md:mt-20 lg:mt-10 tracking-wider text-xl text-center mb-8'>Public Anon Users</h2>
                    <form className='mb-7 md:mb-14'>
                        <div className='relative w-full md:max-w-sm md:mx-auto text-center'>
                            <FiSearch className='absolute mt-4 ml-4' />
                            <Controller
                                name="search"
                                control={control}
                                render={({ field }) => <input onChange={field.onChange} value={field.value} name={field.name} type='text' placeholder='Search users' className='pl-12 placeholder:text-white text-white border border-white rounded-md py-3 transparent w-full' />}
                            />
                        </div>
                    </form>
                    <div className='messages h-[45vh] md:h-[40vh] lg:h-[67vh] overflow-y-auto '>
                        <div className='mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6'>
                            {
                                data?.pages?.map((page:any) => (
                                    page.results.map((value:IUser) => (
                                        <div key={value._id} className='bg-white rounded-md py-4 px-4 flex-1 text-darkblue'>
                                            <div className='flex items-center justify-between'>
                                                <p className='font-medium'>{ value.username }</p>
                                                {
                                                    value.messageCount > 0 &&
                                                    <p onClick={() => navigateToUserPage(value.uniqueId, value.username)} className='cursor-pointer font-medium underline'>
                                                        View
                                                    </p>
                                                }
                                            </div>
                                            <p className='mt-3'>{ value.messageCount } { value.messageCount === 1 ? 'Message' : 'Messages'}</p>
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

export default Users