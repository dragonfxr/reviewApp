import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Container from '../Container';
import Submit from '../form/Submit';
import Title from '../form/Title';
import FormContainer from '../form/FormContainer';
import { commonModalClasses } from '../../utils/theme';
import { verifyUserEmail } from '../../api/auth';
import { useNotification } from '../../hooks';

const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp){
    valid = !isNaN(parseInt(val));
    if (!valid) break;
  };

  return valid;
}

export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  
  const inputRef = useRef();
  const {updateNotification} = useNotification();

  const { state } = useLocation();
  const user = state?.user;

  const navigate = useNavigate();

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPrevInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }) => {
    // everything will be same here just remove the index from 
    // parameter and replace index with currentOTPIndex
    const { value } = target;
    const newOtp = [...otp];
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);
 
    if (!value) focusPrevInputField(currentOTPIndex);
    else focusNextInputField(currentOTPIndex);
 
    setOtp([...newOtp]);
  };

  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
        focusPrevInputField(currentOTPIndex);
     }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isValidOTP(otp)){
      return updateNotification(error, 'invalid OTP');
    };
    const {error, message} = await verifyUserEmail({OTP: otp.join(''), userId: user.id});
    if (error) return updateNotification('error', error);

    updateNotification('success', message);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!user) navigate('/not-found');
  }, [user, navigate]);

  // if (!user) return null;

  return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses}>
              <div>
                <Title>Please Enter the OPT to Verify</Title>
                <p className='text-center dark:text-dark-subtle text-light-subtle'>An OTP has been sent to your email address</p>
              </div>

            <div className='flex justify-center items-center space-x-4'>
              {otp.map((_, index) => {
                return (
                  <input
                    ref={activeOtpIndex === index ? inputRef : null}
                    key={index}
                    type='number' 
                    value={otp[index] || ''}
                    onChange={handleOtpChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className='w-12 h-12 border-2 rounded dark:border-dark-subtle border-light-subtle  
                    dark:focus:border-white focus:border-primary bg-transparent outline-none
                    text-center dark:text-white text-primary font-semibold text-xl spin-button-none'/>
                );
              })}
            </div>
              <Submit value='Verify Account'/>
            </form>
        </Container>
    </FormContainer>
  )
}
