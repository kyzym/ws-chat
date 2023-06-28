import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    body: { type: String, required: [true, 'Message is required'] },
    user: {
      id: Number,
      username: { type: String, required: [true, 'Name is required'] },
    },
  },
  { versionKey: false, timestamps: true }
);

export const Comment = mongoose.model('Comment', CommentSchema);
