import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Container from '../Container';
import Title from '../form/Title';
import Submit from '../form/Submit';
import FormInput from '../form/FormInput';
import FormContainer from '../form/FormContainer';
import { commonModalClasses } from '../../utils/theme';
import { useState } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import { verifyPasswordResetToken, resetPassword } from '../../api/auth';
import { useNotification } from '../../hooks';
import { useEffect } from 'react';

export default function ComfirmPassword() {
  const [password, setPassword] = useState({//password 是一个对象
    one: '',
    two: '',
  })

  //verify reset password token
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  // isValid, isVerifying, !isValid

  useEffect(() => {
    isValidToken();
  }, [])

  const isValidToken = async() => {
    const {error, valid} = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);
    if (error) {
      navigate('/auth/reset-password', {replace: true});//replace the previous history
      return updateNotification('error', error);
    }

    if (!valid) {
      setIsValid(false);
      return navigate('/auth/reset-password', {replace: true});//replace the previous history
    }
    setIsValid(true);
  };

  const handleChange = ({target}) => {//函数收到的是一个“事件对象”，这个对象里有一个属性叫 target
    const {name, value} = target//target 是一个 input 元素，它通常有 name 和 value 属性

    setPassword({...password, [name]: value})//[]:ES6 中的动态属性名（computed property names）
    // password 是一个对象，里面有两个字段分别叫one和two，底下的forminput有写name叫什么。这个set的作用就是改password这个对象里面
    // 分别不同的字段。
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.one.trim()) return updateNotification('error', 'Passwords missing!');//trim():去除字符串开头和结尾的空格、换行符、制表符等“空白字符”

    if (password.one.trim().length < 6) return updateNotification('error', 'Password must be 6 characters long!');

    if (password.one !== password.two) 
      return updateNotification('error', 'Passwords do not match!');
    
    //因为 resetPassword() 是一个异步请求（发请求到服务器），会返回一个 Promise，必须等待结果。
    const {error, message} = await resetPassword({newPassword: password.one, userId: id, token});

    if (error) return updateNotification('error', error);

    //同步函数（如更新 UI、跳转页面）不需要 await。
    updateNotification('success', message);
    navigate('/auth/signin', {replace: true})
  };

  if (isVerifying) 
    return(
      <FormContainer>
        <Container>
          <div className='flex space-x-2 items-center'>
            <h1 className='text-4xl font-semibold dark:text-white text-primary'>Please wait we are verifying your token</h1>
            <ImSpinner3 className='animate-spin text-4xl dark:text-white text-primary' />
          </div>
        </Container>
      </FormContainer>
    )

  if (!isValid) 
    return(
      <FormContainer>
        <Container>
            <h1 className='text-4xl font-semibold dark:text-white text-primary'>The token is not valid!</h1>
        </Container>
      </FormContainer>
    )

  return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + ' w-96'}>
                <Title>Enter New Password</Title>
                <FormInput value={password.one} onChange={handleChange} label='New Password' placeholder='*********' name='one' type='password'/>
                <FormInput value={password.two} onChange={handleChange} label='Confirm Password' placeholder='********' name='two' type='password'/>
                <Submit value='Confirm Password'/>
            </form>
        </Container>
    </FormContainer>
  )
}
