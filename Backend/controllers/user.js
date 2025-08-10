const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EmailVerificationToken = require('../models/emailVerificationToken');
const PasswordResetToken = require('../models/passwordResetToken');
const { isValidObjectId } = require('mongoose');
const { generateOTP, generateMailTransporter } = require('../utils/mail');
const { sendError, generateRandomBytes } = require('../utils/helper');


exports.create = async (req, res) => {
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email });//Mongoose

    if (oldUser) return sendError(res, "This email is already in use!");

    const newUser = new User({ name:name , email:email, password:password });// create a new User object (specified all required fields in User schema)
    await newUser.save();

    // generate 6 digits otp
    let OTP = generateOTP();

    // store otp into the db
    const newEmailVerificationToken = new EmailVerificationToken({ 
      owner:newUser._id, 
      token:OTP,
    });

    await newEmailVerificationToken.save();
    // send that otp to users

    const transport = generateMailTransporter();

    transport.sendMail({
      from: 'verification@reviewapp.com',
      to: newUser.email,
      subject: 'Email Verification',
      html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
      `
    });


    res.status(201).json({ 
      user:{
        id: newUser._id,
        name:newUser.name,
        email: newUser.email,
      },
    });
};

exports.verifyEmail = async (req, res) => {
  const {userId, OTP} = req.body;

  // if it's not a valid user id
  if (!isValidObjectId(userId)){
    return res.json({ error: 'invalid user!' });
  };

  const user = await User.findById(userId);

  // if there's no user having this id.
  if (!user) return sendError(res, "user not found!", 404);

  // if this user is already verified
  // isVerified 是User的一个属性（schema里有），user是User
  if (user.isVerified) return sendError(res, "user is already verified!");

  const token = await EmailVerificationToken.findOne({ owner:userId });
  if (!token) return sendError(res, "token not found!", 404);

  // compareToken is a custormized methods that is defined in the schema(model) file
  // which is a method that can be used for all emailVerificationToken objects
  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Please submit a valid OTP!");

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  const transport = generateMailTransporter();

  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Welcome!',
    html: `<h1>Welcome to our app!</h1>`
  });

  //Usage: jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const jwtToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '10d'});

  res.json({
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      token: jwtToken, 
      isVerified: user.isVerified 
    }, 
    message: 'Your email is verified!', 
  });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const {userId} = req.body;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found!");

  if (user.isVerified) return sendError(res, "This email id is already verified!");

  const token = await EmailVerificationToken.findOne({ owner:userId });
  if (token) return sendError(res, "Only after one hour, you can request for another OTP");

  // generate 6 digits otp
  let OTP = generateOTP(6);

  // store otp into the db
  const newEmailVerificationToken = new EmailVerificationToken({ 
    owner:user._id, 
    token:OTP,
  });

  await newEmailVerificationToken.save();
  // send that otp to users
  const transport = generateMailTransporter();

  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Email Verification',
    html: `
    <p>Your verification OTP</p>
    <h1>${OTP}</h1>
    `
  });

  res.json({ message:"New OTP has been sent!"});
};

exports.forgetPassword = async(req, res) => {
  const {email} = req.body;

  if (!email) return sendError(res, 'Email is missing');

  const user = await User.findOne({email});
  if (!user) return sendError(res, 'User not found!', 404);

  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id});
  if (alreadyHasToken) return sendError(res, 'Only after one hour, you can request for another OTP');

  const token = await generateRandomBytes();
  const newPasswordResetToken = await PasswordResetToken({owner:user._id, token});
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: 'security@reviewapp.com',
    to: user.email,
    subject: 'Reset Password Link',
    html: `
      <p>Click this link to reset your password.</p>
      <a href='${resetPasswordUrl}'>Change Password</a>
    `
  });
  
  res.json({message: 'Links sent to your email!'});
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({valid: true});
};

exports.resetPassword = async (req, res) => {
  const {newPassword, userId} = req.body;

  const user = await User.findById(userId);

  //check if its equal to the old password:
  const matched = await user.comparePassword(newPassword);
  if (matched) return sendError(res, 'The new password must be different from the old one!');

  user.password = newPassword;//model 里有一个hashing的方法是只要有变化就hashing 再save。所以这里暂不用save
  await user.save();

  //delete token 
  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);// this req comes from the middleware function 'isValidPassResetToken'

  const transport = generateMailTransporter();

  transport.sendMail({
    from: 'security@reviewapp.com',
    to: user.email,
    subject: 'Password Reset Successfully',
    html: `
      <h1>Password reset successfully!</h1>
      <p>Try to login using the new password</p>
    `
  });

  res.json({message: 'Password reset successfully!'});
};

exports.signIn = async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if (!user) return sendError(res, 'Email/Password is incorrect!');

  const match = await user.comparePassword(password);
  if (!match) return sendError(res, 'Email/Password is incorrect!');

  const {_id, name, role, isVerified } = user;//_id 是 Mongoose 自动添加的主键字段，不需要手动写，永远都会存在！
  //user 对象里还有 email、isVerified、password 等属性，但不需要email等，只需要name所以就只解构出来name就可以了

  //Usage: jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const jwtToken = jwt.sign({userId: _id}, process.env.JWT_SECRET, {expiresIn: '10d'});
  
  res.json({user : {id:_id, name, email, role, token: jwtToken, isVerified }});
};