import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin DeboShop',
    email: 'deboshop@gmail.com',
    password: bcrypt.hashSync('deboshop12345', 10),
    avatar: {
      public_id: 'example_public_id',
      url: 'https://example.com/avatar.jpg',
    },
    isAdmin: true,
    resetPasswordToken: '', // Initialize resetPasswordToken as empty string
    resetPasswordExpire: undefined, // Initialize resetPasswordExpire as null
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    avatar: {
      public_id: 'example_public_id',
      url: 'https://example.com/avatar.jpg',
    },
    isAdmin: false,
    resetPasswordToken: '', // Initialize resetPasswordToken as empty string
    resetPasswordExpire: undefined, // Initialize resetPasswordExpire as null
  },
  {
    name: 'Jane Doe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    avatar: {
      public_id: 'example_public_id',
      url: 'https://example.com/avatar.jpg',
    },
    isAdmin: false,
    resetPasswordToken: '', // Initialize resetPasswordToken as empty string
    resetPasswordExpire: undefined, // Initialize resetPasswordExpire as null
  },
]

export default users
