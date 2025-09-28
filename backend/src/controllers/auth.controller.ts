import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../config/jwt';
import { generateOTP, sendOTP, isOTPExpired } from '../utils/otp';
import Joi from 'joi';

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).pattern(/^\d+$/).required(),
});

// Request OTP schema (email only)
const requestOTPSchema = Joi.object({
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).pattern(/^\d+$/).required(),
});

// Signup with email
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { email, name } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      email,
      name,
      signupMethod: 'email',
      otpCode,
      otpExpires,
    });

    await user.save();

    // Send OTP
    await sendOTP(email, otpCode);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      data: {
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Verify OTP and complete registration
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = verifyOTPSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { email, otp } = value;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
      return;
    }

    if (!user.otpCode || !user.otpExpires) {
      res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
      return;
    }

    if (isOTPExpired(user.otpExpires)) {
      res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
      return;
    }

    if (user.otpCode !== otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
      return;
    }

    // Verify email and clear OTP
    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      signupMethod: user.signupMethod,
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          signupMethod: user.signupMethod,
        },
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Login with email and OTP
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { email, otp } = value;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(400).json({
        success: false,
        message: 'Please verify your email first',
      });
      return;
    }

    if (!user.otpCode || !user.otpExpires) {
      res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
      return;
    }

    if (isOTPExpired(user.otpExpires)) {
      res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
      return;
    }

    if (user.otpCode !== otp) {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
      return;
    }

    // Clear OTP after successful login
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      signupMethod: user.signupMethod,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          signupMethod: user.signupMethod,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Request new OTP
export const requestOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = requestOTPSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { email } = value;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otpCode;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP
    await sendOTP(email, otpCode);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
