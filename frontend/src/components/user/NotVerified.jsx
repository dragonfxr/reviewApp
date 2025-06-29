import React from 'react'
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router';
import Container from '../Container';

export default function NotVerified() {
  const {authInfo} = useAuth();
  const {isLoggedIn} = authInfo;
  const isVerified = authInfo.profile?.isVerified;

  const navigate = useNavigate();//第二个参数是一个配置对象 { replace, state }，用来控制跳转方式和传参。
  const navigateToVerification = () => {
    navigate('/auth/verification', {state: {user: authInfo.profile}});//点进email verification的时候是通过navigate传参数
  }

  return (
    <Container className='text-lg text-center bg-blue-50 p-2'>
      {isLoggedIn && !isVerified? (
        <p>It looks like you haven't verified your account, {' '}
          <button onClick={navigateToVerification} className='text-blue-500 font-semibold hover:underline'>
            Click to Verify
          </button>
        </p>
      ) : null}
    </Container>
  )
};
