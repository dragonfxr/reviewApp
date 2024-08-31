import React, { useEffect, useRef, useState } from 'react';
import Container from '../Container';
import Submit from '../form/Submit';
import Title from '../form/Title';
import FormContainer from '../form/FormContainer';
import { commonModalClasses } from '../../utils/theme';

const OTP_LENGTH = 6;
let currentOTPIndex;

export default function EmailVerification() {

  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  
  const inputRef = useRef();

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

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <FormContainer>
        <Container>
            <form className={commonModalClasses}>
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
              <Submit value='Send Link'/>
            </form>
        </Container>
    </FormContainer>
  )
}
