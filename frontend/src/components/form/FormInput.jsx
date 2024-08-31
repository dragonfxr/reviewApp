import React from 'react'

export default function FormInput( {name,label, placeholder, ...rest} ) {
  return (
    <div className='flex flex-col-reverse'>
        <input 
          className='bg-transparent border-2 dark:border-dark-subtle border-light-subtle rounded w-full
          text-lg outline-none dark:focus:border-white focus:border-primary p-1 dark:text-white peer transition'//peer
          placeholder={placeholder}
          id={name}
          name={name}
          {...rest}
        />
        <label className='font-semibold dark:text-dark-subtle dark:peer-focus:text-white transition
        text-light-subtle peer-focus:text-primary self-start' htmlFor={name}>{label}</label>
    </div>
  )
}
