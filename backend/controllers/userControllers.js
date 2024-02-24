import User from '../models/Users.js'
import generateToken from '../utils/generateToken.js'
import crypto from 'crypto'

import asyncHandler from '../middleware/asyncHandler.js'
import sendEmail from '../utils/sendEmail.js'

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(401)
    throw new Error(`Invalid email or password`)
  }
})


const registerUser = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User exists')
  }
  const user = await User.create({
    name,
    email,
    password,
  })
  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})


const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(),
  })
  res.status(200).json({ message: 'Logged out successfully' })
})


const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error(`User not found`)
  }
})


const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error(`User not found`)
  }
})


const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
})


const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Cant delete admin user')
    }
    await User.deleteOne({ _id: user._id })
    res.status(200).json({ message: 'User deleted successfully' })
  } else {
    res.status(404)
    throw new error('User not found')
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = Boolean(req.body.isAdmin)
    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not  found')
  }
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Generate reset password token
  const resetToken = user.generateResetPasswordToken()

  // Set the reset password token and its expiration
  user.resetPasswordToken = resetToken
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  await user.save({ validateBeforeSave: false })

  // Send the reset token via email
  const resetUrl = `http://localhost:5000/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
    })

    res.status(200).json({ success: true, data: 'Reset email sent' })
  } catch (error) {
    console.error('Email could not be sent:', error)
    res.status(500).json({ success: false, error: 'Email could not be sent' })
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = req.params.resetToken

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Make sure the token is not expired
  })

  if (!user) {
    res.status(400)
    throw new Error('Invalid or expired token')
  }

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = null
  user.resetPasswordExpire = undefined // Remove the expiration date
  await user.save()

  res.status(200).json({ success: true, data: 'Password reset successful' })
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
  forgotPassword,
  resetPassword,
}
