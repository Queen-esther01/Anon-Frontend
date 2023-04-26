import { Link, Outlet, useLocation } from 'react-router-dom'
import { HiUsers, HiOutlineUsers } from 'react-icons/hi2'
import { RiMessage3Line, RiMessage3Fill, RiSettings5Line, RiSettings5Fill } from 'react-icons/ri'
import { Cookies } from 'react-cookie';
import Header from '../components/layout/Header'
import Logo from '../assets/images/anon-cut-small-black.svg'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/App'
import { useEffect } from 'react';
import { getTokenFromFirebase } from '../utils/firebase';


//page for link share where people can send messages
function App() {
    
    const location = useLocation()
    let cookie = new Cookies()
    let token = cookie.get('x-auth-token')

    // async function name() {
    //     let deviceToken = await getTokenFromFirebase()
    //     console.log(deviceToken)
    // }
    // useEffect(() => {
    //     name()
    // }, [])


    const activeLink = location.pathname.split('/')[2].toLowerCase()


    let links = [
        {
            title: 'Messages',
            link: '/app/messages',
            icon: <RiMessage3Line/>,
            activeIcon: <RiMessage3Fill/>,
        },
        {
            title: 'Users',
            link: '/app/users',
            icon: <HiOutlineUsers/>,
            activeIcon: <HiUsers/>,
        },
        {
            title: 'Settings',
            link: '/app/settings',
            icon: <RiSettings5Line/>,
            activeIcon: <RiSettings5Fill/>,
        }
    ]

    // const icons = {
    //     'Messages' : <BiMessageSquare size={30}/>,
    //     'Users' : <HiOutlineUsers size={30}/>,
    //     'Settings' : <IoSettingsOutline size={30}/>
    // }


    const { data:user } = useQuery({
        queryKey: ['current-user'],
        queryFn: () => getCurrentUser(),
        enabled: !!token
    })


    //sm:max-w-lg md:max-w-xl xl:max-w-5xl sm:mx-auto
    return (
        <main className={`${user?.theme === 'pinkgradient' ? 'pinkgradient' : user?.theme === 'bluegradient' ? 'bluegradient' : 'pinkgradient'} text-white h-screen`}>
            <div className='sm:max-w-lg sm:mx-auto md:max-w-2xl lg:max-w-none'>
                <Header className='sm:hidden' showLink={false}/>
                <div className='sm:py-1'></div>
                <div className='hidden lg:hidden sm:my-10 rounded-md py-2 px-6 w-full sm:flex sm:items-center sm:justify-between bg-[#efd3ff]'>
                    <Link to='/'>
                        <img src={Logo} className='w-16 '/>
                    </Link>
                    <div className='text-darkblue flex justify-between gap-4 md:gap-6'>
                        {
                            links?.map(value => (
                                <Link to={value.link} key={value.link}>
                                    <p className={`${activeLink === value.title.toLowerCase() && 'bg-darkblue text-white'} flex items-center gap-3 cursor-pointer hover:bg-darkblue hover:text-white px-4 py-3 rounded-md`}>
                                    { activeLink === value.title.toLowerCase() ? value.activeIcon : value.icon }
                                        { value.title }
                                    </p>
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <div className='lg:flex'>
                    <div className='hidden lg:block bg-[#efd3ff] rounded-md w-48 h-[80vh] ml-10 px-6 py-2 mt-10'>
                        <Link to='/'>
                            <img src={Logo} className='w-10/12 pl-6 '/>
                        </Link>
                        <hr className='text-darkblue'/>
                        <div className='text-darkblue flex flex-col gap-4 mt-5'>
                            {
                                links?.map(value => (
                                    <Link to={value.link} key={value.link}>
                                        <p className={`${activeLink === value.title.toLowerCase() && 'bg-darkblue text-white'} flex items-center gap-3 cursor-pointer hover:bg-darkblue hover:text-white px-4 py-3 rounded-md`}>
                                            { activeLink === value.title.toLowerCase() ? value.activeIcon : value.icon }
                                            { value.title }
                                        </p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                    <div className='px-6 sm:px-0 lg:px-10 mx-auto lg:w-full'>
                        <Outlet/>
                    </div>
                </div>
                <footer className='sm:hidden px-16 mb-8 fixed bottom-0 left-0 right-0 text-center mx-auto flex items-center justify-between'>
                    <Link to='/app/messages'>
                        {
                            activeLink === 'messages' ? <RiMessage3Fill size={30} className={'text-lilac'}/>
                            : <RiMessage3Line size={30} className='text-gray'/>
                        }
                    </Link>
                    <Link to='/app/users'>
                        {
                            activeLink === 'users' ? <HiUsers size={30} className='text-lilac'/>
                            : <HiOutlineUsers size={30} className={'text-gray'}/>
                        }
                    </Link>
                    <Link to='/app/settings'>
                        {
                            activeLink === 'settings' ? <RiSettings5Fill size={30} className={'text-lilac'}/>
                            : <RiSettings5Line size={30} className={'text-gray'}/>
                        }
                    </Link>
                </footer>
            </div>
        </main>
    )
}

export default App