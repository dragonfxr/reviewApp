import React from 'react';
import Container from '../Container';
import Title from '../form/Title';
import Submit from '../form/Submit';
import CustomLink from '../CustomLink';
import FormInput from '../form/FormInput';
import FormContainer from '../form/FormContainer';
import { commonModalClasses } from '../../utils/theme';
import { useState } from 'react';
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from '../../utils/helper';
import { useNotification } from '../../hooks';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');

  const { updateNotification } = useNotification();

  const handleChange = ({target}) => {
    const {value, name} = target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();//阻止 HTML 表单提交时的默认行为（也就是自动刷新页面）。

    if(!isValidEmail(email)) return updateNotification('error', 'Invalid Email!');
    const {error, message} = await forgetPassword(email);//api

    if(error) return updateNotification('error', error);

    updateNotification('success', message);
  };

  return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + ' w-96'}>
                <Title>Please Enter Your Email</Title>
                <FormInput onChange={handleChange} value={email} label='Email' placeholder='myemail@email.com' name='email'/>
                <Submit value='Send Link'/>
                <div className="flex justify-between">
                    <CustomLink to='/auth/signin'>Sign In</CustomLink>
                    <CustomLink to='/auth/signup'>Sign Up</CustomLink>
                </div>
            </form>
        </Container>
    </FormContainer>
  );
};
