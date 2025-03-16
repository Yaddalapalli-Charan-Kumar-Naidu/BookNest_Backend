import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  // For password hashing
import validator from 'validator';  // For email validation

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email'], // Email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,  // Password length validation
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash if the password is new or modified
  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);  
    next();
  } catch (err) {
    next(err);  
  }
});

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
