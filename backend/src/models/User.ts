// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  password: string;
  signupMethod?: 'email' | 'google' | 'github'; // ✅ added
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 5 },
    signupMethod: { type: String, enum: ['email', 'google'], default: 'email' }, // ✅ added
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);
