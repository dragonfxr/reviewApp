import React from 'react'
import Container from '../Container';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import CustomLink from '../CustomLink';

export default function Signin() {
  return (
    <div className='fixed inset-0 bg-primary -z-10 flex justify-center items-center'>
        <Container>
            <form className='bg-secondary rounded p-6 w-72 space-y-6'>
                <Title>Sign in</Title>
                <FormInput label='email' placeholder='yourEmail@email.com' name='email'/>
                <FormInput label='Password' placeholder='*********' name='password'/>
                <Submit value='Sign in'/>
                <div className="flex justify-between">
                    <CustomLink to='/auth/forget-password'>Forget Password</CustomLink>
                    <CustomLink to='/auth/signup'>Sign Up</CustomLink>
                </div>
            </form>
        </Container>
    </div>
  )
}
