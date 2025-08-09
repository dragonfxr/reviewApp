const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//mongoose会在保存的时候自动生成一个id属性：_id
const actorSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true, // any leading or trailing whitespace in the input string is automatically removed when the string value is saved to the database
        required: true,
    },
    about:{
        type: String,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
    },
    avatar: {
        type: Object,
        url: String,
        public_id: String,
    },
}, {timestamps: true});

actorSchema.index({name:'text'})

module.exports = mongoose.model("Actor", actorSchema);