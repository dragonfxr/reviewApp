const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true, // any leading or trailing whitespace in the input string is automatically removed when the string value is saved to the database
        required: true,
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    isVerified:{
        type: Boolean,
        required: true,
        default: false,
    },
})

userSchema.pre('save', async function(next){ // before saving to the database, the function will run first
    if(this.isModified('password')){
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash
    }
    next();
})

module.exports = mongoose.model("User", userSchema);