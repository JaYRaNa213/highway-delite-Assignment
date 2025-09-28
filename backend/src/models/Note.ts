import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
NoteSchema.index({ userId: 1 });
NoteSchema.index({ createdAt: -1 });

export default mongoose.model<INote>('Note', NoteSchema);
