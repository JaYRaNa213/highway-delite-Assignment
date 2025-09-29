import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../config/jwt';
import Joi from 'joi';
import { transporter } from '../config/mailer';

// ---------------------- VALIDATION SCHEMAS ----------------------
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).optional().allow(''),
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// ---------------------- SEND OTP ----------------------
// ---------------------- SEND OTP ----------------------
export const sendOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, name } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    // Check user
    let user = await User.findOne({ email });

    if (!user) {
      // Signup: create user even if name not provided (can be updated later)
      user = new User({ email, name: name || '', signupMethod: "email" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: `"Highway App" <jayrana0909@gmail.com>`,
 // must be verified sender
      to: email,
      subject: "Your OTP Code for Highway App",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px;">Hi ${user.name || "User"},</p>
          <p style="font-size: 18px; font-weight: bold; background: #f2f2f2; padding: 10px; display: inline-block;">
            ${otp}
          </p>
          <p style="font-size: 14px; color: #555;">This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: user.isNew ? "OTP sent for signup" : "OTP sent for login",
    });
  } catch (error: any) {
    console.error("❌ Send OTP error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};


// ---------------------- VERIFY OTP ----------------------
export const verifyOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = otpSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { email, otp } = value;
    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otpExpires)
      return res.status(400).json({ success: false, message: 'OTP not requested' });

    if (user.otp !== otp || user.otpExpires < new Date())
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    // Clear OTP after verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT
    const token = generateToken({ userId: user._id, email: user.email });

    return res.status(200).json({
      success: true,
      message: 'OTP verified',
      data: { token, user: { _id: user._id, email: user.email, name: user.name } },
    });
  } catch (error: any) {
    console.error('❌ Verify OTP error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
