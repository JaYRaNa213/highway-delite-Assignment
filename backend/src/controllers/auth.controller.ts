import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../config/jwt';
import Joi from 'joi';
import { transporter } from '../config/mailer';

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// ---------------------- SEND OTP ----------------------
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Validate input
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    // Check if user exists or create
    let user = await User.findOne({ email });
    if (!user) {
      if (!name) return res.status(400).json({ success: false, message: 'Name required' });
      user = new User({ email, name, signupMethod: 'email' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email (HTML)
    const mailOptions = {
      from: '"Highway App" <jayrana0909@gmail.com>', // Proper sender
      to: email,
      subject: 'Your OTP Code for Highway App',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px;">Hi ${user.name},</p>
          <p style="font-size: 18px; font-weight: bold; background: #f2f2f2; padding: 10px; display: inline-block;">
            ${otp}
          </p>
          <p style="font-size: 14px; color: #555;">This OTP is valid for 5 minutes.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent info:', info);

    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// ---------------------- VERIFY OTP ----------------------
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { error, value } = otpSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { email, otp } = value;
    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otpExpires)
      return res.status(400).json({ success: false, message: 'OTP not requested' });

    if (user.otp !== otp || user.otpExpires < new Date())
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT
    const token = generateToken({ userId: user._id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'OTP verified',
      data: { token, user: { _id: user._id, email: user.email, name: user.name } },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
