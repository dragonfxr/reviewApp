import React, { useState }from 'react';
import Container from '../Container';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import CustomLink from '../CustomLink';
import { isValidEmail } from '../../utils/helper'
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { useAuth, useNotification } from '../../hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
// import { ThemeContext } from '../context/ThemeProvider';
// import { useTheme } from '../../hooks'

const validateUserInfo = ({ email, password}) => {

  // eslint-disable-next-line
  // eslint-disable-next-line

  if (!email.trim()) return {ok: false, error:'Email is missing'};
  if (!isValidEmail(email)) return {ok: false, error:'Invalid Email'};

  if (!password.trim()) return {ok: false, error:'Password missing'};
  if (password.length < 6) return {ok: false, error:'Password must be at least 6 characters.'};

  return {ok: true};
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email:'',
    password: '',
  });

  const navigate = useNavigate()
  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();//handleLogin, authInfo 的顺序无所谓。“对象解构赋值”，它是按“属性名”匹配的，不看顺序。
  const { isPending, isLoggedIn } = authInfo // 从authInfo解构出来isPending

  const handleChange = ({target}) => {
    const {value, name} = target;
    setUserInfo({...userInfo, [name]:value})
  };

  const handleSubmit = async(e) => {
    e.preventDefault();//阻止 HTML 表单提交时的默认行为（也就是自动刷新页面）。
    const {ok, error} = validateUserInfo(userInfo);

    if(!ok) return updateNotification('error', error);
    handleLogin(userInfo.email, userInfo.password);
  };

  useEffect(() => {
    // move the user to somewhere
    if (isLoggedIn) navigate('/')
   }, [isLoggedIn]);

  return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
                <Title>Sign in</Title>
                <FormInput value={userInfo.email} onChange={handleChange} label='Email' placeholder='yourEmail@email.com' name='email'/>
                <FormInput value={userInfo.password} onChange={handleChange} label='Password' placeholder='*********' name='password' type='password'/>
                <Submit value='Sign in' busy={isPending} />
                <div className="flex justify-between">
                    <CustomLink to='/auth/forget-password'>Forget Password</CustomLink>
                    <CustomLink to='/auth/signup'>Sign Up</CustomLink>
                </div>
            </form>
        </Container>
    </FormContainer>
  )
}
