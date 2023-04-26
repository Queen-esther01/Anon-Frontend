import React from 'react'
import NotFound from '../../assets/images/404-error.png'
import { Link, isRouteErrorResponse } from 'react-router-dom'
import { useRouteError } from "react-router-dom";

function Error404() {
    const error = useRouteError();
    console.error(error);

    if(isRouteErrorResponse(error)){
        if(error.status === 404)
        return (
            <div className='px-6 mt-10 w-full text-center'>
                <img src={NotFound} className='mx-auto'/>
                <p className='text-xl'>Oops, It appears this page does not exist. Are you sure you have the right link?</p>
                <p className='mt-10 underline text-lilac'>
                    <Link to='/app/messages'> Go back to app </Link>
                </p>
            </div>
        )
    }

    return (
        <div className='px-6 mt-10 w-full text-center'>
            <img src={NotFound} className='mx-auto'/>
            <p className='text-xl max-w-md mx-auto'>Oops, Something went wrong. Don't worry, I know what happened and will work on fixing it.</p>
            <p className='mt-10 underline text-lilac'>
                <Link to='/app/messages'> Go back to app </Link>
            </p>
        </div>
    )
}

export default Error404