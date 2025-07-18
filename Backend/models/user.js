const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//mongoose会在保存的时候自动生成一个id属性：_id
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
});

userSchema.methods.comparePassword = async function(password) {
    const result = await bcrypt.compare(password, this.password);//this.token 这个schema的里的一个属性token
    return result;
};

module.exports = mongoose.model("User", userSchema);