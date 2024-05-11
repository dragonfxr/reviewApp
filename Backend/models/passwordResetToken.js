const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordResetTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",// model called User
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    expires: 3600,//  3600s
    default: Date.now(),
  },

});

// hash the token
passwordResetTokenSchema.pre('save', async function(next){ // before saving to the database, the function will run first
  if(this.isModified('token')){
      const hash = await bcrypt.hash(this.token, 10);
      this.token = hash
  }
  next();
});

passwordResetTokenSchema.methods.compareToken = async function(token) {
  const result = await bcrypt.compare(token, this.token);//this.token 这个schema的里的一个属性token
  return result;
};

module.exports = mongoose.model("passwordResetToken", passwordResetTokenSchema);
