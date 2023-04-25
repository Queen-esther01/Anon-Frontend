import React from "react"


interface TextareaInterface {
    label?: string,
    placeholder?: string,
    className?: string,
    error?: string,
    [key:string]: any
}
const Textarea = React.forwardRef(({ label, placeholder, className, errors, ...otherProps }:TextareaInterface, ref) => {
    return (
        <div className='mt-0'>
            { label && <label className='text-sm'>{ label }</label>}
            <textarea onChange={otherProps.onChange} value={otherProps.value} name={otherProps.name} placeholder={placeholder} className={`${className} ${errors && errors[otherProps.name] ? 'border-red' : 'border-lightGray'}` + ' border rounded-md py-2 text-sm outline-teal text-gray h-36 w-full'} {...otherProps}/>
            { errors && <p className='text-red text-sm'>{ errors[otherProps.name]?.message }</p>}
        </div>
    )
})

export default Textarea