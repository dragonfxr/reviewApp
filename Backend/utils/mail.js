exports.generateOTP = (otp_length = 6) => {
    let OTP = '';
    for (let i = 1; i <= otp_length; i++){
       const randomVal = Math.round(Math.random() * 9);
       OTP += randomVal;
    };
    return OTP;
};

exports.generateMailTransporter = () => {
    nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "2e1f716afe5176",
          pass: "50ae504ae34c5a"
        }
    });
};