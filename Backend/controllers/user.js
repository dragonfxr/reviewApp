const nodemailer = require('nodemailer');
const User = require('../models/user');
const EmailVerificationToken = require('../models/emailVerificationToken');
const { isValidObjectId } = require('mongoose');

exports.create = async (req, res) => {
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email });//Mongoose

    if (oldUser) return res.status(401).json({error: 'This email address is already in use!'});

    const newUser = new User({ name:name , email:email, password:password });// create a new User object (specified all required fields in User schema)
    await newUser.save();

    // generate 6 digits otp
    let OTP = '';
    for (let i = 0; i <= 5; i++){
       const randomVal = Math.round(Math.random() * 9);
       OTP += randomVal;
    };
    // store otp into the db
    const newEmailVerificationToken = new EmailVerificationToken({ 
      owner:newUser._id, 
      token:OTP,
    });

    await newEmailVerificationToken.save();
    // send that otp to users

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "2e1f716afe5176",
          pass: "50ae504ae34c5a"
        }
    });

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
      message: 'Please verify your email! An OTP has been sent to your account.' 
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
  if (!user) return res.json({ error: 'user not found!'});

  // if this user is already verified
  // isVerified 是User的一个属性（schema里有），user是User
  if (user.isVerified) return res.json({ error: 'user is already verified!'});

  const token = await EmailVerificationToken.findOne({ owner:userId });
  if (!token) return res.json({ error: 'token not found!'});

  // compareToken is a custormized methods that is defined in the schema(model) file
  // which is a method that can be used for all emailVerificationToken objects
  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return res.json( {error: 'Please submit a valid OTP!' });

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2e1f716afe5176",
      pass: "50ae504ae34c5a"
    }
  });

  transport.sendMail({
    from: 'verification@reviewapp.com',
    to: user.email,
    subject: 'Welcome!',
    html: `<h1>Welcome to our app!</h1>`
  });

  res.json({ message: 'Your email is verified!' });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const {userId} = req.body;

  const user = await User.findById(userId);
  if (!user) return res.json({ error: 'user not found!'});

  if (user.isVerified) return res.json({ error: 'This email id is already verified!'});

  const token = await EmailVerificationToken.findOne({ owner:userId });
  if (token) return res.json({ error: "Only after one hour, you can request for another OTP" });

  // generate 6 digits otp
  let OTP = '';
  for (let i = 0; i <= 5; i++){
     const randomVal = Math.round(Math.random() * 9);
     OTP += randomVal;
  };
  // store otp into the db
  const newEmailVerificationToken = new EmailVerificationToken({ 
    owner:user._id, 
    token:OTP,
  });

  await newEmailVerificationToken.save();
  // send that otp to users
  var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2e1f716afe5176",
        pass: "50ae504ae34c5a"
      }
  });

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