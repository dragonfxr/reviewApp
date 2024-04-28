const User = require('../models/user');

exports.create =  async(req, res) => {
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email });//Mongoose

    if (oldUser) return res.status(401).json({error: 'This email address is already in use!'});

    const newUser = new User({ name:name , email:email, password:password })
    await newUser.save()

    res.status(201).json({ user: newUser });
};