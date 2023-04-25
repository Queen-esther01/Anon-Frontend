import React from 'react'
import { ITextInput } from '../../interface/interfaces'

const TextInput = React.forwardRef(({ errors, type, placeholder, icon, className, ...otherProps }:ITextInput, ref) => {

    return (
        <div className={`${type === 'checkbox' && 'flex gap-3 flex-row-reverse row'}`}>
            <div className='relative'>
                <input onChange={otherProps.onChange} value={otherProps.value} name={otherProps.name} type={type} placeholder={placeholder} className={`${className} ${errors && errors[otherProps.name] ? 'border-red ' : 'border-lightGray'}` + ' border rounded-md text-sm outline-darkblue text-darkblue w-full pl-6 mt-2 mb-1 py-4'} {...otherProps} />
                {icon && <span className='absolute top-7 right-3'>{icon}</span>}
            </div>
            { errors && <p className='text-red text-sm'>{ errors[otherProps.name]?.message }</p>}
        </div>
    )

})

export default TextInput