import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from "crypto"
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar:{
     public_id:String,
     url:String
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken:String,
    ressetPasswordExpire:Date
  },
  {
    timestamps: true,
  }
)
userSchema.methods.generateResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash the token and save it to the user's document
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set the expiration time for the token (e.g., 10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken // Return the unhashed token to be sent via email
}
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', userSchema)

export default User
