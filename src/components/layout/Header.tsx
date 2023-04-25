import React from 'react'
import { IHeader } from '../../interface/interfaces'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/anon-small-logo.png'


function Header({ linkText, link, showLink, className }:IHeader) {
    return (
        <div className={`${className} flex items-center justify-between w-full md:max-w-lg md:mx-auto pr-6`}>
            <Link to='/'>
                <img src={Logo} className='w-32'/>
            </Link>
            {
                showLink && <Link to={link!}>
                    { linkText}
                </Link>
            }
        </div>
    )
}

export default Header