import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  signupMethod: 'email' | 'google';
  otp?: string | null;
  otpExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: false, trim: true, default: '' },
    signupMethod: { type: String, enum: ['email', 'google'], default: 'email', required: true },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);
