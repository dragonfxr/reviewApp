import React from 'react';
import Navbar from './components/user/Navbar';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import EmailVerification from './components/auth/EmailVerification';
import ForgetPassword from './components/auth/ForgetPassword';
import ComfirmPassword from './components/auth/ComfirmPassword';
import { Routes, Route } from 'react-router';
import Home from './components/Home';
import NotFound from './components/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/auth/signin' element = {<Signin/>}/>
        <Route path='/auth/signup' element = {<Signup/>}/>
        <Route path='/auth/verification' element = {<EmailVerification />}/>
        <Route path='/auth/forget-password' element = {<ForgetPassword />}/>
        <Route path='/auth/confirm-password' element = {<ComfirmPassword />}/>
        <Route path='*' element = {<NotFound/>}/> 
      </Routes>
    </>
  )
};