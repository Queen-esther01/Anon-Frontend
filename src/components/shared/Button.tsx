import React from 'react'
import { IButton } from '../../interface/interfaces'

function Button({ children, className, onClick }:IButton) {
    return (
        <button onClick={onClick} className={`${className} bg-lilac text-darkblue font-medium py-3 px-4 rounded-md w-full`}>
            { children }
        </button>
    )
}

export default Button