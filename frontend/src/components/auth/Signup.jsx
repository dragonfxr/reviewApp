import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import Container from '../Container';
import Title from '../form/Title';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import CustomLink from '../CustomLink';
import { commonModalClasses } from '../../utils/theme';
import FormContainer from '../form/FormContainer';
import { createUser } from '../../api/auth';

const validateUserInfo = ({name, email, password}) => {

  const isValidName = /^[a-z A-Z]+$/
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!name.trim()) return {ok:false, error:'Name is Missing!'};
  if (!isValidName.test(name)) return {ok: false, error: 'Invalid Name'};

  if (!email.trim()) return {ok: false, error:'Email is missing'};
  if (!isValidEmail.test(email)) return {ok: false, error:'Invalid Email'};

  if (!password.trim()) return {ok: false, error:'Password missing'};
  if (password.length < 6) return {ok: false, error:'Password must be at least 6 characters.'};

  return {ok: true};
};


export default function Signup() {

  const [userInfo, setUserInfo] = useState({
    name:'',
    email:'',
    password: '',
  });

  const navigate = useNavigate();

  const {name, email, password} = userInfo;

  const handleChange = ({target}) => {
    const {value, name} = target;
    setUserInfo({...userInfo, [name]:value})
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const{ok, error} = validateUserInfo(userInfo);

    if(!ok) return console.log(error);

    const response = await createUser(userInfo);
    if (response.error) return console.log(response.error);

    navigate('/auth/verification', {
      state: { user: response.user }, 
      replace: true ///replace****:does not store the history
    });
  };

  return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + ' w-72'}>
                <Title>Sign up</Title>
                <FormInput value={name} onChange={handleChange} label='Name' placeholder='Your Name' name='name'/>
                <FormInput value={email} onChange={handleChange} label='Email' placeholder='yourEmail@email.com' name='email'/>
                <FormInput value={password} onChange={handleChange} label='Password' placeholder='*********' name='password' type='password'/>
                <Submit value='Sign up'/>
                <div className="flex justify-between">
                    <CustomLink to='/auth/forget-password'>Forget Password</CustomLink>
                    <CustomLink to='/auth/signin'>Sign In</CustomLink>
                </div>
            </form>
        </Container>
    </FormContainer>
  )
}
