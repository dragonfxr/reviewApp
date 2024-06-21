import React from 'react'

export default function FormInput( {name,label, placeholder, ...rest} ) {
  return (
    <div className='flex flex-col-reverse'>
        <input 
          className='bg-transparent border-2 border-dark-subtle rounded w-full
          text-lg outline-none focus:border-white p-1 text-white peer transition'//peer
          placeholder={placeholder}
          id={name}
          name={name}
          {...rest}
        />
        <label className='font-semibold text-dark-subtle peer-focus:text-white transition
        self-start' htmlFor={name}>{label}</label>
    </div>
  )
}
